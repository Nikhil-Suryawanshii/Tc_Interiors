import { createContext, useContext, useEffect, useState } from 'react';
import { siteSettingsAPI } from '@services/api';

const SiteSettingsContext = createContext(null);

const DEFAULTS = {
  siteName: 'TC Interior', ownerName: 'TC Interior', tagline: 'Luxury Interior Design & Furniture',
  bio: '', contactEmail: '', phone: '', whatsappNumber: '', location: '',
  logoText: { prefix: 'TC', suffix: ' Interior' },
  showHireBtn: true, hireBtnLabel: 'Get a Quote', calendlyUrl: '',
  footerText: '© {year} TC Interior. All rights reserved.',
  navLinks: [
    { label: 'Home',     path: '/',         visible: true, order: 0 },
    { label: 'Products', path: '/products', visible: true, order: 1 },
    { label: 'Gallery',  path: '/gallery',  visible: true, order: 2 },
    { label: 'Services', path: '/services', visible: true, order: 3 },
    { label: 'Blog',     path: '/blog',     visible: true, order: 4 },
    { label: 'About',    path: '/about',    visible: true, order: 5 },
    { label: 'Contact',  path: '/contact',  visible: true, order: 6 },
  ],
  social: { instagram:'', facebook:'', pinterest:'', youtube:'', linkedin:'', twitter:'' },
  seo: {},
  theme: { accentColor:'#b8860b', accentColorEnd:'#8b6914', darkModeDefault: false },
};

export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULTS);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    siteSettingsAPI.get()
      .then(r => { const d = r.data?.data; if (d) setSettings({ ...DEFAULTS, ...d }); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const navLinks = (settings.navLinks || [])
    .filter(l => l.visible !== false)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  const footerText = (settings.footerText || '').replace('{year}', new Date().getFullYear());

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, navLinks, footerText }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) throw new Error('useSettings must be inside SiteSettingsProvider');
  return ctx;
};

export default SiteSettingsContext;
