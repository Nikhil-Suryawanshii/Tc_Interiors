import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { uploadSettingsAsset } from '../utils/api';
import toast from 'react-hot-toast';
import './AdminSettings.css';

const BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || '';

const TABS = [
  { id: 'site',    label: 'Logo & Branding',  icon: '🏷️' },
  { id: 'theme',   label: 'Theme & Colors',   icon: '🎨' },
  { id: 'contact', label: 'Contact Info',     icon: '📍' },
  { id: 'social',  label: 'Social Media',     icon: '🔗' },
  { id: 'footer',  label: 'Footer',           icon: '📄' },
  { id: 'hero',    label: 'Hero Section',     icon: '🖼️' },
  { id: 'about',   label: 'About Page',       icon: '👥' },
  { id: 'seo',     label: 'SEO',              icon: '🔍' },
];

const Field = ({ label, name, value, onChange, type = 'text', placeholder = '', textarea = false, hint = '' }) => (
  <div className="admin-field">
    <label>{label}</label>
    {textarea
      ? <textarea rows={4} name={name} value={value || ''} onChange={onChange} placeholder={placeholder} />
      : <input type={type} name={name} value={value || ''} onChange={onChange} placeholder={placeholder} />
    }
    {hint && <span className="field-hint">{hint}</span>}
  </div>
);

/* ─── COLOR GROUPS for the Theme tab ─── */
const COLOR_GROUPS = [
  {
    group: 'Core Palette',
    desc: 'Base colours used across the whole site',
    fields: [
      { key: 'primaryColor',  label: 'Primary / Gold',        def: '#c9a96e' },
      { key: 'primaryLight',  label: 'Gold — Light variant',  def: '#e8d5aa' },
      { key: 'primaryDark',   label: 'Gold — Dark variant',   def: '#a07840' },
      { key: 'darkColor',     label: 'Charcoal (main dark)',  def: '#1a1208' },
      { key: 'darkDeep',      label: 'Deep Dark',             def: '#0e0c08' },
      { key: 'darkMedium',    label: 'Medium Dark',           def: '#3d3220' },
      { key: 'lightColor',    label: 'Warm White (bg)',       def: '#faf8f4' },
      { key: 'creamColor',    label: 'Cream',                 def: '#f5f0e8' },
    ],
  },
  {
    group: 'Text & Borders',
    desc: 'Body text, muted text and divider lines',
    fields: [
      { key: 'textBody',    label: 'Body Text',    def: '#5c4d38' },
      { key: 'textLight',   label: 'Muted Text',   def: '#8c7860' },
      { key: 'borderColor', label: 'Border / Line', def: '#e0d4c0' },
    ],
  },
  {
    group: 'Navbar',
    desc: 'Top navigation bar colours',
    fields: [
      { key: 'navBg',          label: 'Nav Background',     def: '#faf8f4' },
      { key: 'navText',        label: 'Nav Links',          def: '#1a1208' },
      { key: 'navActiveColor', label: 'Active / Hover Link',def: '#c9a96e' },
      { key: 'navScrollBg',    label: 'Nav on Scroll',      def: '#faf8f4' },
    ],
  },
  {
    group: 'Admin Sidebar',
    desc: 'Backend admin panel sidebar',
    fields: [
      { key: 'sidebarBg',     label: 'Sidebar Background',  def: '#0e0c08' },
      { key: 'sidebarText',   label: 'Sidebar Text',        def: '#faf8f4' },
      { key: 'sidebarActive', label: 'Active Item / Accent', def: '#c9a96e' },
    ],
  },
  {
    group: 'Hero Section',
    desc: 'Homepage hero banner',
    fields: [
      { key: 'heroBg',     label: 'Hero Background', def: '#1a1208' },
      { key: 'heroText',   label: 'Hero Text',       def: '#f5f0e8' },
      { key: 'heroAccent', label: 'Hero Accent',     def: '#c9a96e' },
    ],
  },
  {
    group: 'Buttons',
    desc: 'Primary action and gold buttons',
    fields: [
      { key: 'btnPrimaryBg',   label: 'Primary Button BG',   def: '#1a1208' },
      { key: 'btnPrimaryText', label: 'Primary Button Text',  def: '#f5f0e8' },
      { key: 'btnGoldBg',      label: 'Gold Button BG',       def: '#c9a96e' },
      { key: 'btnGoldText',    label: 'Gold Button Text',     def: '#1a1208' },
    ],
  },
  {
    group: 'Footer',
    desc: 'Site footer background and text',
    fields: [
      { key: 'footerBg',    label: 'Footer Background', def: '#1a1208' },
      { key: 'footerText',  label: 'Footer Text',       def: '#f5f0e8' },
      { key: 'footerMuted', label: 'Footer Muted Text', def: 'rgba(245,240,232,0.55)' },
    ],
  },
  {
    group: 'Page Hero Banners',
    desc: 'Dark header bar shown on inner pages (Services, Shop, etc.)',
    fields: [
      { key: 'pageHeroBg',   label: 'Page Hero Background', def: '#1a1208' },
      { key: 'pageHeroText', label: 'Page Hero Text',        def: '#f5f0e8' },
    ],
  },
];

/* Preset palettes */
const PRESETS = [
  {
    name: 'Luxe Gold (Default)',
    emoji: '✨',
    values: {
      primaryColor: '#c9a96e', primaryLight: '#e8d5aa', primaryDark: '#a07840',
      darkColor: '#1a1208', darkDeep: '#0e0c08', darkMedium: '#3d3220',
      lightColor: '#faf8f4', creamColor: '#f5f0e8',
      textBody: '#5c4d38', textLight: '#8c7860', borderColor: '#e0d4c0',
      navBg: '#faf8f4', navText: '#1a1208', navActiveColor: '#c9a96e',
      heroBg: '#1a1208', heroText: '#f5f0e8', heroAccent: '#c9a96e',
      btnPrimaryBg: '#1a1208', btnPrimaryText: '#f5f0e8',
      btnGoldBg: '#c9a96e', btnGoldText: '#1a1208',
      footerBg: '#1a1208', footerText: '#f5f0e8',
      sidebarBg: '#0e0c08', sidebarText: '#faf8f4', sidebarActive: '#c9a96e',
      pageHeroBg: '#1a1208', pageHeroText: '#f5f0e8',
    }
  },
  {
    name: 'Midnight Blue',
    emoji: '🌙',
    values: {
      primaryColor: '#7b9dd6', primaryLight: '#aec3e8', primaryDark: '#4a6fa5',
      darkColor: '#0d1b2a', darkDeep: '#060e17', darkMedium: '#1e3a52',
      lightColor: '#f4f7fb', creamColor: '#eaf0f8',
      textBody: '#2c3e50', textLight: '#6c8ca3', borderColor: '#c8d8e8',
      navBg: '#f4f7fb', navText: '#0d1b2a', navActiveColor: '#7b9dd6',
      heroBg: '#0d1b2a', heroText: '#f4f7fb', heroAccent: '#7b9dd6',
      btnPrimaryBg: '#0d1b2a', btnPrimaryText: '#f4f7fb',
      btnGoldBg: '#7b9dd6', btnGoldText: '#0d1b2a',
      footerBg: '#0d1b2a', footerText: '#f4f7fb',
      sidebarBg: '#060e17', sidebarText: '#f4f7fb', sidebarActive: '#7b9dd6',
      pageHeroBg: '#0d1b2a', pageHeroText: '#f4f7fb',
    }
  },
  {
    name: 'Emerald Forest',
    emoji: '🌿',
    values: {
      primaryColor: '#5a9e6f', primaryLight: '#8ec9a0', primaryDark: '#3a7a52',
      darkColor: '#0f1f14', darkDeep: '#08130d', darkMedium: '#1e3a27',
      lightColor: '#f4faf6', creamColor: '#eaf5ee',
      textBody: '#2c3e2f', textLight: '#618068', borderColor: '#c0dcc8',
      navBg: '#f4faf6', navText: '#0f1f14', navActiveColor: '#5a9e6f',
      heroBg: '#0f1f14', heroText: '#f4faf6', heroAccent: '#5a9e6f',
      btnPrimaryBg: '#0f1f14', btnPrimaryText: '#f4faf6',
      btnGoldBg: '#5a9e6f', btnGoldText: '#0f1f14',
      footerBg: '#0f1f14', footerText: '#f4faf6',
      sidebarBg: '#08130d', sidebarText: '#f4faf6', sidebarActive: '#5a9e6f',
      pageHeroBg: '#0f1f14', pageHeroText: '#f4faf6',
    }
  },
  {
    name: 'Dusty Rose',
    emoji: '🌸',
    values: {
      primaryColor: '#c47a8a', primaryLight: '#e0aab6', primaryDark: '#9a5a6a',
      darkColor: '#2a1018', darkDeep: '#1a080e', darkMedium: '#4a2030',
      lightColor: '#fdf6f8', creamColor: '#f9ecef',
      textBody: '#4a2030', textLight: '#8a6070', borderColor: '#e8c8d0',
      navBg: '#fdf6f8', navText: '#2a1018', navActiveColor: '#c47a8a',
      heroBg: '#2a1018', heroText: '#fdf6f8', heroAccent: '#c47a8a',
      btnPrimaryBg: '#2a1018', btnPrimaryText: '#fdf6f8',
      btnGoldBg: '#c47a8a', btnGoldText: '#2a1018',
      footerBg: '#2a1018', footerText: '#fdf6f8',
      sidebarBg: '#1a080e', sidebarText: '#fdf6f8', sidebarActive: '#c47a8a',
      pageHeroBg: '#2a1018', pageHeroText: '#fdf6f8',
    }
  },
  {
    name: 'Classic Monochrome',
    emoji: '🖤',
    values: {
      primaryColor: '#555555', primaryLight: '#888888', primaryDark: '#333333',
      darkColor: '#111111', darkDeep: '#000000', darkMedium: '#2a2a2a',
      lightColor: '#fafafa', creamColor: '#f2f2f2',
      textBody: '#333333', textLight: '#777777', borderColor: '#dedede',
      navBg: '#fafafa', navText: '#111111', navActiveColor: '#555555',
      heroBg: '#111111', heroText: '#fafafa', heroAccent: '#888888',
      btnPrimaryBg: '#111111', btnPrimaryText: '#fafafa',
      btnGoldBg: '#555555', btnGoldText: '#fafafa',
      footerBg: '#111111', footerText: '#fafafa',
      sidebarBg: '#000000', sidebarText: '#fafafa', sidebarActive: '#888888',
      pageHeroBg: '#111111', pageHeroText: '#fafafa',
    }
  },
];

/* live-preview CSS-var injection (no save needed) */
const CSS_VAR_MAP = {
  primaryColor:'--gold', primaryLight:'--gold-light', primaryDark:'--gold-dark',
  darkColor:'--charcoal', darkDeep:'--dark', darkMedium:'--medium',
  lightColor:'--warm-white', creamColor:'--cream',
  textBody:'--text-body', textLight:'--text-light', borderColor:'--border',
  navBg:'--nav-bg', navText:'--nav-text', navActiveColor:'--nav-active',
  sidebarBg:'--sidebar-bg', sidebarText:'--sidebar-text', sidebarActive:'--sidebar-active',
  heroBg:'--hero-bg', heroText:'--hero-text', heroAccent:'--hero-accent',
  btnPrimaryBg:'--btn-primary-bg', btnPrimaryText:'--btn-primary-text',
  btnGoldBg:'--btn-gold-bg', btnGoldText:'--btn-gold-text',
  footerBg:'--footer-bg', footerText:'--footer-text', footerMuted:'--footer-muted',
  pageHeroBg:'--page-hero-bg', pageHeroText:'--page-hero-text',
};
const livePreview = (theme) => {
  const root = document.documentElement;
  Object.entries(CSS_VAR_MAP).forEach(([k, v]) => { if (theme[k]) root.style.setProperty(v, theme[k]); });
};

const AdminSettings = () => {
  const { settings, updateSettings } = useSettings();
  const [tab, setTab]       = useState('site');
  const [form, setForm]     = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(settings[tab] ? JSON.parse(JSON.stringify(settings[tab])) : {});
  }, [tab, settings]);

  const set = e => {
    const updated = { ...form, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value };
    setForm(updated);
    if (tab === 'theme') livePreview(updated);
  };

  const applyPreset = (preset) => {
    setForm(p => ({ ...p, ...preset.values }));
    livePreview(preset.values);
    toast.success(`Preset "${preset.name}" applied — click Save to keep it`);
  };

  const extractUploadedUrl = (result) => {
    if (typeof result === 'string') return result;
    if (typeof result?.data?.url === 'string') return result.data.url;
    if (typeof result?.url === 'string') return result.url;
    return '';
  };

  const handleLogoUpload = async e => {
    const file = e.target.files[0]; if (!file) return;
    try {
      const result = await uploadSettingsAsset(file);
      const url = extractUploadedUrl(result);
      if (!url) throw new Error('Upload did not return a URL');
      setForm(p => ({ ...p, logo: url }));
      toast.success('Logo uploaded');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Upload failed');
    }
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0]; if (!file) return;
    try {
      const result = await uploadSettingsAsset(file);
      const url = extractUploadedUrl(result);
      if (!url) throw new Error('Upload did not return a URL');
      setForm(p => ({ ...p, [field]: url }));
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Upload failed');
    }
  };

  const handleStatChange = (i, key, val) => { const stats = [...(form.stats||[])]; stats[i]={...stats[i],[key]:val}; setForm(p=>({...p,stats})); };
  const addStat    = () => setForm(p => ({ ...p, stats: [...(p.stats||[]), { number:'', label:'' }] }));
  const removeStat = i  => setForm(p => ({ ...p, stats: p.stats.filter((_,j)=>j!==i) }));

  const handleTeamChange = (i, key, val) => { const team=[...(form.team||[])]; team[i]={...team[i],[key]:val}; setForm(p=>({...p,team})); };
  const addTeam    = () => setForm(p => ({ ...p, team: [...(p.team||[]), { name:'', role:'', image:'' }] }));
  const removeTeam = i  => setForm(p => ({ ...p, team: p.team.filter((_,j)=>j!==i) }));

  const handleSave = async () => {
    setSaving(true);
    try { await updateSettings(tab, form); toast.success('Settings saved!'); }
    catch { toast.error('Save failed'); } finally { setSaving(false); }
  };

  const imgUrl = src => {
    const value =
      typeof src === 'string' ? src :
      typeof src?.url === 'string' ? src.url :
      typeof src?.data?.url === 'string' ? src.data.url :
      '';
    return value ? (value.startsWith('http') ? value : `${BASE}${value}`) : null;
  };

  return (
    <div className="admin-settings-page">
      <div className="admin-page-header">
        <div><h1>Site Settings</h1><p>Manage logo, colour palette, contact info, footer and page content</p></div>
      </div>

      <div className="settings-layout">
        {/* TAB NAV */}
        <nav className="settings-tabs">
          {TABS.map(t => (
            <button key={t.id} className={`settings-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              <span className="tab-icon">{t.icon}</span>
              <span className="tab-label">{t.label}</span>
            </button>
          ))}
        </nav>

        {/* PANEL */}
        <div className="settings-panel">

          {/* ── SITE / LOGO ── */}
          {tab === 'site' && (
            <div className="settings-section">
              <h2>Logo & Branding</h2>
              <div className="logo-upload-area">
                {imgUrl(form.logo)
                  ? <img src={imgUrl(form.logo)} alt="Logo" className="logo-preview" />
                  : <div className="logo-placeholder">{form.logoText || 'LOGO'}</div>
                }
                <div>
                  <label className="upload-btn">
                    📁 Upload Logo Image
                    <input type="file" accept="image/*" onChange={handleLogoUpload} style={{display:'none'}} />
                  </label>
                  <p className="field-hint">PNG or SVG recommended. Leave empty to use text logo.</p>
                  {form.logo && <button className="btn-admin btn-admin-danger btn-admin-sm" style={{marginTop:'0.5rem'}} onClick={()=>setForm(p=>({...p,logo:''}))}>Remove Logo</button>}
                </div>
              </div>
              <div className="admin-form-row">
                <Field label="Logo Text (shown if no image)" name="logoText" value={form.logoText} onChange={set} placeholder="Luxe" />
                <Field label="Logo Sub Text" name="logoSubText" value={form.logoSubText} onChange={set} placeholder="Interior Studio" />
              </div>
              <Field label="Site Tagline" name="tagline" value={form.tagline} onChange={set} placeholder="Crafting Spaces That Speak Your Story" />
              <Field label="Site Description" name="description" value={form.description} onChange={set} textarea placeholder="Short description used in SEO and footer" />
            </div>
          )}

          {/* ── THEME ── */}
          {tab === 'theme' && (
            <div className="settings-section">
              <h2>Theme & Color Palette</h2>
              <p className="section-meta">Changes preview live on the site — click Save to make them permanent.</p>

              {/* Preset Palettes */}
              <div className="palette-presets">
                <div className="palette-presets-label">Quick Presets</div>
                <div className="preset-cards">
                  {PRESETS.map(p => (
                    <button key={p.name} className="preset-card" onClick={() => applyPreset(p)} type="button">
                      <div className="preset-swatches">
                        <span style={{background: p.values.primaryColor}} />
                        <span style={{background: p.values.darkColor}} />
                        <span style={{background: p.values.lightColor}} />
                        <span style={{background: p.values.heroBg}} />
                      </div>
                      <span className="preset-emoji">{p.emoji}</span>
                      <span className="preset-name">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Groups */}
              {COLOR_GROUPS.map(grp => (
                <div className="color-group" key={grp.group}>
                  <div className="color-group-header">
                    <h3>{grp.group}</h3>
                    <span>{grp.desc}</span>
                  </div>
                  <div className="color-grid">
                    {grp.fields.map(({ key, label, def }) => (
                      <div className="color-field" key={key}>
                        <label>{label}</label>
                        <div className="color-input-row">
                          <input type="color" name={key} value={form[key] || def} onChange={set} className="color-swatch" />
                          <input type="text"  name={key} value={form[key] || def} onChange={set} className="color-hex" />
                        </div>
                        <div className="color-preview-bar" style={{background: form[key] || def}} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Fonts */}
              <div className="color-group">
                <div className="color-group-header">
                  <h3>Typography</h3>
                  <span>Google Font names for headings and body text</span>
                </div>
                <div className="admin-form-row">
                  <Field label="Display Font (headings)" name="fontDisplay" value={form.fontDisplay} onChange={set} placeholder="Cormorant Garamond" hint="Google Font name" />
                  <Field label="Body Font" name="fontBody" value={form.fontBody} onChange={set} placeholder="Jost" hint="Google Font name" />
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="theme-live-preview">
                <div className="preview-label">Live Preview</div>
                <div className="preview-card">
                  <div className="preview-nav" style={{ background: form.navBg||'#faf8f4', borderBottom: `1px solid ${form.borderColor||'#e0d4c0'}` }}>
                    <span style={{ fontFamily: form.fontDisplay||'serif', color: form.navText||'#1a1208', fontSize: '1rem' }}>
                      {form.logoText||'Luxe'} <em style={{color: form.navActiveColor||'#c9a96e'}}>Studio</em>
                    </span>
                    <div style={{display:'flex',gap:'1rem'}}>
                      {['Home','Shop','Projects'].map(l => (
                        <span key={l} style={{ fontFamily: form.fontBody||'sans-serif', fontSize: '0.75rem', color: form.navText||'#1a1208', letterSpacing:'0.1em' }}>{l}</span>
                      ))}
                    </div>
                  </div>
                  <div className="preview-hero" style={{ background: form.heroBg||'#1a1208', padding:'1.5rem' }}>
                    <div style={{ fontFamily: form.fontDisplay||'serif', fontSize:'1.5rem', color: form.heroText||'#f5f0e8', marginBottom:'0.5rem' }}>
                      Spaces That <em style={{color: form.heroAccent||'#c9a96e'}}>Speak</em>
                    </div>
                    <div style={{ display:'flex', gap:'0.75rem', marginTop:'0.75rem' }}>
                      <span className="preview-btn" style={{ background: form.btnPrimaryBg||'#1a1208', color: form.btnPrimaryText||'#f5f0e8', border:`1px solid ${form.btnPrimaryBg||'#1a1208'}` }}>Explore</span>
                      <span className="preview-btn" style={{ background: form.btnGoldBg||'#c9a96e', color: form.btnGoldText||'#1a1208', border:`1px solid ${form.btnGoldBg||'#c9a96e'}` }}>Shop Now</span>
                    </div>
                  </div>
                  <div className="preview-footer" style={{ background: form.footerBg||'#1a1208', padding:'0.75rem 1rem' }}>
                    <span style={{ fontFamily: form.fontBody||'sans-serif', fontSize:'0.72rem', color: form.footerText||'#f5f0e8', letterSpacing:'0.05em' }}>
                      © 2025 {form.logoText||'Luxe'} Interior Studio
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── CONTACT ── */}
          {tab === 'contact' && (
            <div className="settings-section">
              <h2>Contact Information</h2>
              <Field label="Studio Address" name="address" value={form.address} onChange={set} textarea placeholder="Full address" />
              <div className="admin-form-row">
                <Field label="Primary Phone" name="phone"  value={form.phone}  onChange={set} placeholder="+91 22 1234 5678" />
                <Field label="Secondary Phone" name="phone2" value={form.phone2} onChange={set} placeholder="+91 98765 43210" />
              </div>
              <div className="admin-form-row">
                <Field label="Primary Email" name="email"  value={form.email}  onChange={set} placeholder="hello@luxeinterior.in" />
                <Field label="Secondary Email" name="email2" value={form.email2} onChange={set} placeholder="projects@luxeinterior.in" />
              </div>
              <div className="admin-form-row">
                <Field label="Weekday Hours" name="hoursWeekday" value={form.hoursWeekday} onChange={set} placeholder="Mon – Sat: 10:00 AM – 7:00 PM" />
                <Field label="Weekend Hours" name="hoursWeekend" value={form.hoursWeekend} onChange={set} placeholder="Sunday: 11:00 AM – 5:00 PM" />
              </div>
              <Field label="WhatsApp Number" name="whatsapp" value={form.whatsapp} onChange={set} placeholder="+91 98765 43210" hint="Used for WhatsApp chat button" />
              <Field label="Google Maps Embed URL" name="mapUrl" value={form.mapUrl} onChange={set} placeholder="https://www.google.com/maps/embed?..." textarea />
            </div>
          )}

          {/* ── SOCIAL ── */}
          {tab === 'social' && (
            <div className="settings-section">
              <h2>Social Media Links</h2>
              {[['instagram','📸 Instagram URL'],['facebook','📘 Facebook URL'],['linkedin','💼 LinkedIn URL'],['youtube','▶️ YouTube URL'],['twitter','🐦 Twitter/X URL'],['pinterest','📌 Pinterest URL']].map(([key,label]) => (
                <Field key={key} label={label} name={key} value={form[key]} onChange={set} placeholder={`https://${key}.com/...`} />
              ))}
            </div>
          )}

          {/* ── FOOTER ── */}
          {tab === 'footer' && (
            <div className="settings-section">
              <h2>Footer Settings</h2>
              <Field label="Footer About Text" name="about" value={form.about} onChange={set} textarea placeholder="Short description shown in footer brand column" />
              <Field label="Copyright Text" name="copyright" value={form.copyright} onChange={set} placeholder={`© ${new Date().getFullYear()} Luxe Interior Studio. All rights reserved.`} />
              <div className="admin-field">
                <label style={{display:'flex',alignItems:'center',gap:'0.5rem',cursor:'pointer'}}>
                  <input type="checkbox" name="showNewsletter" checked={!!form.showNewsletter} onChange={set} />
                  Show Newsletter Signup in Footer
                </label>
              </div>
            </div>
          )}

          {/* ── HERO ── */}
          {tab === 'hero' && (
            <div className="settings-section">
              <h2>Homepage Hero Section</h2>
              <div className="admin-form-row">
                <Field label="Hero Title" name="title" value={form.title} onChange={set} placeholder="Spaces That" />
                <Field label="Hero Title (italic/accent part)" name="titleEm" value={form.titleEm} onChange={set} placeholder="Speak Your Story" />
              </div>
              <Field label="Hero Description" name="description" value={form.description} onChange={set} textarea placeholder="We craft exceptional interiors..." />
              <div className="image-upload-field">
                <label>Hero Background Image</label>
                {imgUrl(form.image) && <img src={imgUrl(form.image)} alt="Hero" className="setting-img-preview" />}
                <label className="upload-btn">
                  📁 Upload Image
                  <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'image')} style={{display:'none'}} />
                </label>
                {form.image && <button className="btn-admin btn-admin-danger btn-admin-sm" onClick={()=>setForm(p=>({...p,image:''}))}>Remove</button>}
              </div>
              <Field label="Background Video URL (YouTube embed)" name="videoUrl" value={form.videoUrl} onChange={set} placeholder="https://www.youtube.com/embed/..." />
              <div className="admin-form-row">
                <Field label="Button 1 Text" name="btn1Text" value={form.btn1Text} onChange={set} placeholder="Explore Work" />
                <Field label="Button 1 Link" name="btn1Link" value={form.btn1Link} onChange={set} placeholder="/projects" />
              </div>
              <div className="admin-form-row">
                <Field label="Button 2 Text" name="btn2Text" value={form.btn2Text} onChange={set} placeholder="Shop Now" />
                <Field label="Button 2 Link" name="btn2Link" value={form.btn2Link} onChange={set} placeholder="/shop" />
              </div>
            </div>
          )}

          {/* ── ABOUT ── */}
          {tab === 'about' && (
            <div className="settings-section">
              <h2>About Page Content</h2>
              <Field label="Hero Title" name="heroTitle" value={form.heroTitle} onChange={set} placeholder="Designing with Purpose & Passion" />
              <div className="image-upload-field">
                <label>Hero Background Image</label>
                {imgUrl(form.heroImage) && <img src={imgUrl(form.heroImage)} alt="About Hero" className="setting-img-preview" />}
                <label className="upload-btn">
                  📁 Upload Image
                  <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'heroImage')} style={{display:'none'}} />
                </label>
              </div>
              <Field label="Intro Text (Paragraph 1)" name="intro"   value={form.intro}   onChange={set} textarea />
              <Field label="Mission Text (Paragraph 2)" name="mission" value={form.mission} onChange={set} textarea />

              <div className="subsection">
                <div className="subsection-header">
                  <h3>Stats</h3>
                  <button type="button" className="btn-admin btn-admin-primary btn-admin-sm" onClick={addStat}>+ Add Stat</button>
                </div>
                {(form.stats || []).map((s, i) => (
                  <div key={i} className="repeat-row">
                    <input placeholder="Number (e.g. 250+)" value={s.number} onChange={e=>handleStatChange(i,'number',e.target.value)} />
                    <input placeholder="Label (e.g. Projects)" value={s.label} onChange={e=>handleStatChange(i,'label',e.target.value)} />
                    <button type="button" className="btn-admin btn-admin-danger btn-admin-sm" onClick={()=>removeStat(i)}>✕</button>
                  </div>
                ))}
              </div>

              <div className="subsection">
                <div className="subsection-header">
                  <h3>Team Members</h3>
                  <button type="button" className="btn-admin btn-admin-primary btn-admin-sm" onClick={addTeam}>+ Add Member</button>
                </div>
                {(form.team || []).map((m, i) => (
                  <div key={i} className="team-row">
                    <input placeholder="Name" value={m.name} onChange={e=>handleTeamChange(i,'name',e.target.value)} />
                    <input placeholder="Role / Title" value={m.role} onChange={e=>handleTeamChange(i,'role',e.target.value)} />
                    <button type="button" className="btn-admin btn-admin-danger btn-admin-sm" onClick={()=>removeTeam(i)}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SEO ── */}
          {tab === 'seo' && (
            <div className="settings-section">
              <h2>SEO Settings</h2>
              <Field label="Meta Title" name="metaTitle" value={form.metaTitle} onChange={set} placeholder="Luxe Interior Studio – Premium Interior Design" />
              <Field label="Meta Description" name="metaDescription" value={form.metaDescription} onChange={set} textarea placeholder="150–160 characters description" />
              <Field label="Keywords" name="keywords" value={form.keywords} onChange={set} placeholder="interior design, furniture, decor, Mumbai" hint="Comma separated" />
              <div className="image-upload-field">
                <label>OG Image (Social Share Preview)</label>
                {imgUrl(form.ogImage) && <img src={imgUrl(form.ogImage)} alt="OG" className="setting-img-preview" />}
                <label className="upload-btn">
                  📁 Upload OG Image
                  <input type="file" accept="image/*" onChange={e=>handleImageUpload(e,'ogImage')} style={{display:'none'}} />
                </label>
              </div>
            </div>
          )}

          {/* SAVE BAR */}
          <div className="settings-save-bar">
            <button className="btn-admin btn-admin-primary" onClick={handleSave} disabled={saving}>
              {saving ? '⏳ Saving...' : '💾 Save Changes'}
            </button>
            <span className="save-hint">Changes apply immediately to the live site</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
