import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';

const SettingsContext = createContext({});

const DEFAULTS = {
  site: { logo: '', logoText: 'Luxe', logoSubText: 'Interior Studio', tagline: '', description: '' },
  theme: { primaryColor: '#c9a96e', darkColor: '#1a1208', lightColor: '#faf8f4' },
  contact: { address: '', phone: '', email: '', hoursWeekday: '', hoursWeekend: '' },
  social: { instagram: '', facebook: '', linkedin: '', youtube: '' },
  footer: { about: '', copyright: '' },
  about: { heroTitle: '', intro: '', stats: [], team: [] },
  hero: { title: 'Spaces That', titleEm: 'Speak Your Story', description: '', btn1Text: 'Explore Work', btn1Link: '/projects', btn2Text: 'Shop Now', btn2Link: '/shop' },
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    API.get('/settings')
      .then(r => { setSettings({ ...DEFAULTS, ...r.data }); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  const updateSettings = async (key, data) => {
    const res = await API.put(`/settings/${key}`, data);
    setSettings(prev => ({ ...prev, [key]: { ...prev[key], ...data } }));
    return res.data;
  };

  return (
    <SettingsContext.Provider value={{ settings, loaded, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
