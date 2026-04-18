import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../utils/api';

const SettingsContext = createContext({});

const DEFAULTS = {
  site: { logo: '', logoText: 'Luxe', logoSubText: 'Interior Studio', tagline: '', description: '' },
  theme: {
    primaryColor:   '#c9a96e',
    primaryLight:   '#e8d5aa',
    primaryDark:    '#a07840',
    darkColor:      '#1a1208',
    darkDeep:       '#0e0c08',
    darkMedium:     '#3d3220',
    lightColor:     '#faf8f4',
    creamColor:     '#f5f0e8',
    textBody:       '#5c4d38',
    textLight:      '#8c7860',
    borderColor:    '#e0d4c0',
    navBg:          '#faf8f4',
    navText:        '#1a1208',
    navActiveColor: '#c9a96e',
    navScrollBg:    '#faf8f4',
    sidebarBg:      '#0e0c08',
    sidebarText:    '#faf8f4',
    sidebarActive:  '#c9a96e',
    sidebarBorder:  'rgba(201,169,110,0.12)',
    heroBg:         '#1a1208',
    heroText:       '#f5f0e8',
    heroAccent:     '#c9a96e',
    btnPrimaryBg:   '#1a1208',
    btnPrimaryText: '#f5f0e8',
    btnGoldBg:      '#c9a96e',
    btnGoldText:    '#1a1208',
    footerBg:       '#1a1208',
    footerText:     '#f5f0e8',
    footerMuted:    'rgba(245,240,232,0.55)',
    pageHeroBg:     '#1a1208',
    pageHeroText:   '#f5f0e8',
    fontDisplay:    'Cormorant Garamond',
    fontBody:       'Jost',
  },
  contact: { address: '', phone: '', email: '', hoursWeekday: '', hoursWeekend: '' },
  social: { instagram: '', facebook: '', linkedin: '', youtube: '' },
  footer: { about: '', copyright: '' },
  about: { heroTitle: '', intro: '', stats: [], team: [] },
  hero: {
    title: 'Spaces That', titleEm: 'Speak Your Story', description: '',
    btn1Text: 'Explore Work', btn1Link: '/projects',
    btn2Text: 'Shop Now', btn2Link: '/shop',
  },
  seo: { metaTitle: '', metaDescription: '', keywords: '', ogImage: '' },
};

const CSS_VAR_MAP = {
  primaryColor:   '--gold',
  primaryLight:   '--gold-light',
  primaryDark:    '--gold-dark',
  darkColor:      '--charcoal',
  darkDeep:       '--dark',
  darkMedium:     '--medium',
  lightColor:     '--warm-white',
  creamColor:     '--cream',
  textBody:       '--text-body',
  textLight:      '--text-light',
  borderColor:    '--border',
  navBg:          '--nav-bg',
  navText:        '--nav-text',
  navActiveColor: '--nav-active',
  navScrollBg:    '--nav-scroll-bg',
  sidebarBg:      '--sidebar-bg',
  sidebarText:    '--sidebar-text',
  sidebarActive:  '--sidebar-active',
  sidebarBorder:  '--sidebar-border',
  heroBg:         '--hero-bg',
  heroText:       '--hero-text',
  heroAccent:     '--hero-accent',
  btnPrimaryBg:   '--btn-primary-bg',
  btnPrimaryText: '--btn-primary-text',
  btnGoldBg:      '--btn-gold-bg',
  btnGoldText:    '--btn-gold-text',
  footerBg:       '--footer-bg',
  footerText:     '--footer-text',
  footerMuted:    '--footer-muted',
  pageHeroBg:     '--page-hero-bg',
  pageHeroText:   '--page-hero-text',
};

const applyThemeToCSSVars = (theme) => {
  const root = document.documentElement;
  Object.entries(CSS_VAR_MAP).forEach(([key, cssVar]) => {
    if (theme[key]) root.style.setProperty(cssVar, theme[key]);
  });
  if (theme.fontDisplay || theme.fontBody) {
    const existing = document.getElementById('dynamic-fonts');
    const fonts = [theme.fontDisplay, theme.fontBody]
      .filter(Boolean)
      .map(f => f.replace(/ /g, '+'))
      .join('&family=');
    const href = `https://fonts.googleapis.com/css2?family=${fonts}:wght@300;400;500;600&display=swap`;
    if (existing) { existing.href = href; }
    else {
      const link = document.createElement('link');
      link.id = 'dynamic-fonts'; link.rel = 'stylesheet'; link.href = href;
      document.head.appendChild(link);
    }
    if (theme.fontDisplay) root.style.setProperty('--font-display', `'${theme.fontDisplay}', Georgia, serif`);
    if (theme.fontBody)    root.style.setProperty('--font-body',    `'${theme.fontBody}', sans-serif`);
  }
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULTS);
  const [loaded, setLoaded]     = useState(false);

  useEffect(() => {
    API.get('/settings')
      .then(r => {
        const merged = { ...DEFAULTS, ...r.data };
        setSettings(merged);
        if (merged.theme) applyThemeToCSSVars({ ...DEFAULTS.theme, ...merged.theme });
        setLoaded(true);
      })
      .catch(() => {
        applyThemeToCSSVars(DEFAULTS.theme);
        setLoaded(true);
      });
  }, []);

  const updateSettings = useCallback(async (key, data) => {
    const res = await API.put(`/settings/${key}`, data);
    setSettings(prev => {
      const next = { ...prev, [key]: { ...prev[key], ...data } };
      if (key === 'theme') applyThemeToCSSVars({ ...DEFAULTS.theme, ...next.theme });
      return next;
    });
    return res.data;
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loaded, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
