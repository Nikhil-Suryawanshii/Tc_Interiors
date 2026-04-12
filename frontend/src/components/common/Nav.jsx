import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiMenu, FiX, FiShoppingCart } from 'react-icons/fi';
import { useTheme } from '@contexts/ThemeContext';
import { useSettings } from '@contexts/SiteSettingsContext';
import { useCart } from '@contexts/CartContext';

/* TC Interiors Brand Logo Component */
const TCLogo = ({ size = 'md' }) => {
  const sizes = { sm: { icon: 28, textMain: 15, textSub: 10 }, md: { icon: 36, textMain: 18, textSub: 11 }, lg: { icon: 44, textMain: 22, textSub: 13 } };
  const s = sizes[size] || sizes.md;
  return (
    <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
      {/* TC Icon Mark */}
      <div style={{ position:'relative', width: s.icon, height: s.icon, flexShrink:0 }}>
        <svg width={s.icon} height={s.icon} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* T - white */}
          <rect x="4" y="4" width="18" height="5" fill="white"/>
          <rect x="10" y="4" width="5" height="22" fill="white"/>
          {/* C - yellow */}
          <circle cx="28" cy="26" r="14" fill="#d4f500"/>
          <circle cx="28" cy="26" r="8" fill="black"/>
          <rect x="26" y="12" width="16" height="28" fill="black"/>
        </svg>
      </div>
      {/* Text Mark */}
      <div style={{ display:'flex', flexDirection:'column', lineHeight:1 }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:0 }}>
          <span style={{ fontFamily:'Impact, "Arial Black", sans-serif', fontWeight:900, fontSize: s.textMain, color:'white', letterSpacing:'-0.5px', textTransform:'uppercase' }}>THE </span>
          <span style={{ fontFamily:'Impact, "Arial Black", sans-serif', fontWeight:900, fontSize: s.textMain, color:'#d4f500', letterSpacing:'-0.5px', textTransform:'uppercase' }}>CONCEPT</span>
        </div>
        <span style={{ fontFamily:'"Georgia", serif', fontSize: s.textSub, color:'#d4f500', fontStyle:'italic', letterSpacing:'0.5px', marginTop:1 }}>Interiors</span>
      </div>
    </div>
  );
};

const Nav = () => {
  const { isDark, toggle }       = useTheme();
  const { settings, navLinks }   = useSettings();
  const { totalItems }           = useCart();
  const location                 = useLocation();
  const [menuOpen, setMenuOpen]  = useState(false);
  const [scrolled, setScrolled]  = useState(false);

  const isActive = (path) => path==='/' ? location.pathname==='/' : location.pathname.startsWith(path);
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive:true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      <motion.nav initial={{ y:-80, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ duration:0.7, ease:[0.16,1,0.3,1] }}
        className="fixed top-0 w-full z-50 px-4 md:px-6">
        <div className="max-w-7xl mx-auto mt-3">
          <div className={`flex justify-between items-center h-16 px-5 bg-black/95 dark:bg-black backdrop-blur-xl border border-[#d4f500]/20 rounded-2xl shadow-sm transition-all duration-300 ${scrolled?'shadow-[0_4px_24px_rgba(212,245,0,0.08)]':''}`}>
            <motion.div whileHover={{ scale:1.03 }}>
              <Link to="/" style={{ textDecoration:'none' }}>
                <TCLogo size="sm" />
              </Link>
            </motion.div>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(item => (
                <Link key={item.path} to={item.path}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors group ${isActive(item.path)?'text-[#d4f500]':'text-stone-400 hover:text-white'}`}>
                  {item.label}
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-[#d4f500] transition-all duration-300 ${isActive(item.path)?'w-4/5':'w-0 group-hover:w-4/5'}`}/>
                </Link>
              ))}
              {/* Dark toggle */}
              <motion.button onClick={toggle} whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
                className="ml-2 p-2 rounded-xl bg-white/10 border border-white/10 text-stone-300 hover:bg-white/20 transition-all">
                <motion.div key={isDark?'sun':'moon'} initial={{ rotate:-90, opacity:0 }} animate={{ rotate:0, opacity:1 }} transition={{ duration:0.3 }}>
                  {isDark ? <FiSun size={16}/> : <FiMoon size={16}/>}
                </motion.div>
              </motion.button>
              {/* Cart */}
              <Link to="/cart" className="relative ml-2 p-2 rounded-xl bg-[#d4f500] hover:bg-[#c8e800] text-black transition-colors shadow-lg shadow-[#d4f500]/20">
                <FiShoppingCart size={16}/>
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </Link>
              {settings.showHireBtn !== false && (
                <Link to="/contact" className="ml-2 px-5 py-2 bg-[#d4f500] hover:bg-[#c8e800] text-black text-sm font-bold rounded-xl transition-colors shadow-lg shadow-[#d4f500]/20">
                  {settings.hireBtnLabel || 'Get a Quote'}
                </Link>
              )}
            </div>

            {/* Mobile */}
            <div className="flex md:hidden items-center gap-2">
              <Link to="/cart" className="relative p-2 rounded-xl bg-[#d4f500] text-black">
                <FiShoppingCart size={16}/>
                {totalItems > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{totalItems}</span>}
              </Link>
              <motion.button onClick={toggle} whileTap={{ scale:0.9 }}
                className="p-2 rounded-xl bg-white/10 border border-white/10 text-stone-300">
                {isDark ? <FiSun size={16}/> : <FiMoon size={16}/>}
              </motion.button>
              <motion.button onClick={()=>setMenuOpen(!menuOpen)} whileTap={{ scale:0.9 }}
                className="p-2 rounded-xl bg-white/10 border border-white/10 text-stone-300">
                {menuOpen ? <FiX size={18}/> : <FiMenu size={18}/>}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div key="mm" initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}
              transition={{ duration:0.25 }}
              className="fixed top-24 left-4 right-4 z-40 bg-black border border-[#d4f500]/20 rounded-2xl shadow-xl overflow-hidden">
              <div className="flex flex-col py-3">
                {navLinks.map(item => (
                  <Link key={item.path} to={item.path}
                    className={`px-6 py-3.5 text-sm font-semibold transition-colors ${isActive(item.path)?'text-[#d4f500] bg-[#d4f500]/10':'text-stone-300 hover:bg-white/5 hover:text-white'}`}>
                    {item.label}
                  </Link>
                ))}
                {settings.showHireBtn !== false && (
                  <div className="px-4 py-3 border-t border-white/10 mt-1">
                    <Link to="/contact" className="block text-center py-3 bg-[#d4f500] hover:bg-[#c8e800] text-black font-bold rounded-xl transition-colors">
                      {settings.hireBtnLabel || 'Get a Quote'}
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
            <motion.div key="bd" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              onClick={()=>setMenuOpen(false)}
              className="fixed inset-0 z-30 bg-black/50 md:hidden"/>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav;
