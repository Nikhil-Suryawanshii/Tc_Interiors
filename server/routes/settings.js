const router = require('express').Router();
const Settings = require('../models/Settings');
const { protect, admin } = require('../middleware/auth');

const DEFAULTS = {
  site: {
    logo: '', logoText: 'Luxe', logoSubText: 'Interior Studio',
    favicon: '', tagline: 'Crafting Spaces That Speak Your Story',
    description: 'Premium interior design, bespoke furniture, and curated decor.',
  },
  theme: {
    /* Core palette */
    primaryColor:   '#c9a96e',
    primaryLight:   '#e8d5aa',
    primaryDark:    '#a07840',
    darkColor:      '#1a1208',
    darkDeep:       '#0e0c08',
    darkMedium:     '#3d3220',
    lightColor:     '#faf8f4',
    creamColor:     '#f5f0e8',
    /* Text */
    textBody:       '#5c4d38',
    textLight:      '#8c7860',
    /* Borders */
    borderColor:    '#e0d4c0',
    /* Navbar */
    navBg:          '#faf8f4',
    navText:        '#1a1208',
    navActiveColor: '#c9a96e',
    navScrollBg:    '#faf8f4',
    /* Admin sidebar */
    sidebarBg:      '#0e0c08',
    sidebarText:    '#faf8f4',
    sidebarActive:  '#c9a96e',
    sidebarBorder:  'rgba(201,169,110,0.12)',
    /* Hero */
    heroBg:         '#1a1208',
    heroText:       '#f5f0e8',
    heroAccent:     '#c9a96e',
    /* Buttons */
    btnPrimaryBg:   '#1a1208',
    btnPrimaryText: '#f5f0e8',
    btnGoldBg:      '#c9a96e',
    btnGoldText:    '#1a1208',
    /* Footer */
    footerBg:       '#1a1208',
    footerText:     '#f5f0e8',
    footerMuted:    'rgba(245,240,232,0.55)',
    /* Page hero banners */
    pageHeroBg:     '#1a1208',
    pageHeroText:   '#f5f0e8',
    /* Fonts */
    fontDisplay:    'Cormorant Garamond',
    fontBody:       'Jost',
  },
  contact: {
    address: '123 Design District, Bandra West, Mumbai, Maharashtra 400050',
    phone: '+91 22 1234 5678', phone2: '+91 98765 43210',
    email: 'hello@luxeinterior.in', email2: 'projects@luxeinterior.in',
    hoursWeekday: 'Mon – Sat: 10:00 AM – 7:00 PM', hoursWeekend: 'Sunday: 11:00 AM – 5:00 PM',
    mapUrl: '', whatsapp: '',
  },
  social: {
    instagram: 'https://instagram.com', facebook: 'https://facebook.com',
    linkedin: 'https://linkedin.com', youtube: 'https://youtube.com',
    twitter: '', pinterest: '',
  },
  footer: {
    about: 'Crafting spaces that tell your story. Premium interior design, bespoke furniture, and curated decor for discerning homes across India.',
    copyright: `© ${new Date().getFullYear()} Luxe Interior Studio. All rights reserved.`,
    showNewsletter: true,
  },
  about: {
    heroTitle: 'Designing with Purpose & Passion',
    heroImage: '',
    intro: 'Founded in 2012, Luxe Interior Studio has grown from a two-person team in Mumbai to a full-service design practice with over 250 completed projects across India.',
    mission: 'We believe that exceptional design is not a luxury — it\'s a necessity. Our approach is rooted in listening.',
    stats: [
      { number: '250+', label: 'Projects Completed' },
      { number: '12+',  label: 'Years of Experience' },
      { number: '98%',  label: 'Client Satisfaction' },
      { number: '50+',  label: 'Design Awards' },
    ],
    team: [
      { name: 'Aisha Kapoor',  role: 'Principal Designer',          image: '' },
      { name: 'Rahul Mehta',   role: 'Project Director',            image: '' },
      { name: 'Priya Sharma',  role: 'Senior Interior Designer',    image: '' },
      { name: 'Vikram Nair',   role: '3D Visualization Lead',       image: '' },
    ],
  },
  hero: {
    title: 'Spaces That', titleEm: 'Speak Your Story',
    description: 'We craft exceptional interiors — from bespoke furniture to complete home transformations.',
    image: '', videoUrl: '',
    btn1Text: 'Explore Work', btn1Link: '/projects',
    btn2Text: 'Shop Now',     btn2Link: '/shop',
  },
  seo: {
    metaTitle: 'Luxe Interior Studio – Premium Interior Design & Furniture',
    metaDescription: 'Premium interior design, bespoke furniture and curated decor for exceptional spaces across India.',
    keywords: 'interior design, furniture, decor, Mumbai, India',
    ogImage: '',
  },
};

/* GET all settings */
router.get('/', async (req, res) => {
  try {
    const docs = await Settings.find();
    const result = { ...DEFAULTS };
    docs.forEach(d => { result[d.key] = { ...(DEFAULTS[d.key] || {}), ...d.value }; });
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* GET single key */
router.get('/:key', async (req, res) => {
  try {
    const doc    = await Settings.findOne({ key: req.params.key });
    const merged = { ...(DEFAULTS[req.params.key] || {}), ...(doc?.value || {}) };
    res.json(merged);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* PUT upsert by key (admin only) */
router.put('/:key', protect, admin, async (req, res) => {
  try {
    const doc = await Settings.findOneAndUpdate(
      { key: req.params.key },
      { value: req.body },
      { new: true, upsert: true }
    );
    res.json(doc);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
