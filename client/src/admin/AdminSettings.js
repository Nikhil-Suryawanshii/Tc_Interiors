import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { uploadImage } from '../utils/api';
import toast from 'react-hot-toast';
import './AdminSettings.css';

const BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || '';

const TABS = [
  { id: 'site',    label: '🏷️ Logo & Branding' },
  { id: 'theme',   label: '🎨 Theme & Colors' },
  { id: 'contact', label: '📍 Contact Info' },
  { id: 'social',  label: '🔗 Social Media' },
  { id: 'footer',  label: '📄 Footer' },
  { id: 'hero',    label: '🖼️ Hero Section' },
  { id: 'about',   label: '👥 About Page' },
  { id: 'seo',     label: '🔍 SEO' },
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

const AdminSettings = () => {
  const { settings, updateSettings } = useSettings();
  const [tab, setTab]       = useState('site');
  const [form, setForm]     = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(settings[tab] ? JSON.parse(JSON.stringify(settings[tab])) : {});
  }, [tab, settings]);

  const set = e => setForm(p => ({ ...p, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const handleLogoUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData(); fd.append('file', file);
    try {
      const r = await uploadImage(fd);
      setForm(p => ({ ...p, logo: r.data.url }));
      toast.success('Logo uploaded');
    } catch { toast.error('Upload failed'); }
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData(); fd.append('file', file);
    try {
      const r = await uploadImage(fd);
      setForm(p => ({ ...p, [field]: r.data.url }));
      toast.success('Image uploaded');
    } catch { toast.error('Upload failed'); }
  };

  const handleStatChange = (i, key, val) => {
    const stats = [...(form.stats || [])];
    stats[i] = { ...stats[i], [key]: val };
    setForm(p => ({ ...p, stats }));
  };
  const addStat    = () => setForm(p => ({ ...p, stats: [...(p.stats||[]), { number:'', label:'' }] }));
  const removeStat = i  => setForm(p => ({ ...p, stats: p.stats.filter((_,j)=>j!==i) }));

  const handleTeamChange = (i, key, val) => {
    const team = [...(form.team || [])];
    team[i] = { ...team[i], [key]: val };
    setForm(p => ({ ...p, team }));
  };
  const addTeam    = () => setForm(p => ({ ...p, team: [...(p.team||[]), { name:'', role:'', image:'' }] }));
  const removeTeam = i  => setForm(p => ({ ...p, team: p.team.filter((_,j)=>j!==i) }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(tab, form);
      toast.success('Settings saved!');
    } catch { toast.error('Save failed'); } finally { setSaving(false); }
  };

  const imgUrl = src => src ? (src.startsWith('http') ? src : `${BASE}${src}`) : null;

  return (
    <div className="admin-settings-page">
      <div className="admin-page-header">
        <div><h1>Site Settings</h1><p>Manage logo, theme, contact info, footer and page content</p></div>
      </div>

      <div className="settings-layout">
        {/* TAB NAV */}
        <nav className="settings-tabs">
          {TABS.map(t => (
            <button key={t.id} className={`settings-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </nav>

        {/* TAB CONTENT */}
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
                  <p className="field-hint">PNG or SVG recommended. Leave empty to use text logo below.</p>
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
              <h2>Theme & Colors</h2>
              <div className="color-grid">
                {[
                  ['primaryColor', 'Primary / Gold Color', '#c9a96e'],
                  ['darkColor',    'Dark / Charcoal Color', '#1a1208'],
                  ['lightColor',   'Light / Background Color', '#faf8f4'],
                  ['accentColor',  'Accent Color', '#c9a96e'],
                ].map(([key, label, def]) => (
                  <div className="color-field" key={key}>
                    <label>{label}</label>
                    <div className="color-input-row">
                      <input type="color" name={key} value={form[key] || def} onChange={set} className="color-swatch" />
                      <input type="text"  name={key} value={form[key] || def} onChange={set} className="color-hex" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="admin-form-row">
                <Field label="Display Font (heading)" name="fontDisplay" value={form.fontDisplay} onChange={set} placeholder="Cormorant Garamond" hint="Google Font name" />
                <Field label="Body Font" name="fontBody" value={form.fontBody} onChange={set} placeholder="Jost" hint="Google Font name" />
              </div>
              <div className="theme-preview">
                <div style={{ background: form.darkColor||'#1a1208', padding:'1rem 1.5rem', color: form.lightColor||'#faf8f4', fontFamily: form.fontDisplay||'serif', fontSize:'1.5rem' }}>
                  Preview: {form.logoText || 'Luxe'}
                  <span style={{ color: form.primaryColor||'#c9a96e', marginLeft:'0.5rem' }}>Studio</span>
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
              {[
                ['instagram', '📸 Instagram URL'],
                ['facebook',  '📘 Facebook URL'],
                ['linkedin',  '💼 LinkedIn URL'],
                ['youtube',   '▶️ YouTube URL'],
                ['twitter',   '🐦 Twitter/X URL'],
                ['pinterest', '📌 Pinterest URL'],
              ].map(([key, label]) => (
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
                <Field label="Hero Title (italic/gold part)" name="titleEm" value={form.titleEm} onChange={set} placeholder="Speak Your Story" />
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
                    <div className="team-img-upload">
                      {imgUrl(m.image) && <img src={imgUrl(m.image)} alt="" style={{width:40,height:40,objectFit:'cover',borderRadius:'50%'}} />}
                      <label className="upload-btn-sm">
                        📷
                        <input type="file" accept="image/*" onChange={async e => {
                          const file = e.target.files[0]; if (!file) return;
                          const fd = new FormData(); fd.append('file', file);
                          try { const r = await uploadImage(fd); handleTeamChange(i, 'image', r.data.url); } catch {}
                        }} style={{display:'none'}} />
                      </label>
                    </div>
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

          {/* SAVE BUTTON */}
          <div className="settings-save-bar">
            <button className="btn-admin btn-admin-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : '💾 Save Changes'}
            </button>
            <span className="save-hint">Changes apply immediately to the live site</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
