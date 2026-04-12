// src/components/common/PageLoader.jsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PageLoader = ({ isLoading }) => {
  const [show, setShow] = useState(isLoading);

  useEffect(() => {
    if (isLoading) { setShow(true); return; }
    const t = setTimeout(() => setShow(false), 600);
    return () => clearTimeout(t);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="page-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: '#050500',
          }}
        >
          {/* TC Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 48 }}
          >
            <svg width="52" height="52" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="18" height="5" fill="white"/>
              <rect x="10" y="4" width="5" height="22" fill="white"/>
              <circle cx="28" cy="26" r="14" fill="#d4f500"/>
              <circle cx="28" cy="26" r="8" fill="#050500"/>
              <rect x="26" y="12" width="16" height="28" fill="#050500"/>
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <div>
                <span style={{ fontFamily: 'Impact, "Arial Black", sans-serif', fontWeight: 900, fontSize: 24, color: 'white', textTransform: 'uppercase' }}>THE </span>
                <span style={{ fontFamily: 'Impact, "Arial Black", sans-serif', fontWeight: 900, fontSize: 24, color: '#d4f500', textTransform: 'uppercase' }}>CONCEPT</span>
              </div>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 13, color: '#d4f500', fontStyle: 'italic', marginTop: 3 }}>Interiors</span>
            </div>
          </motion.div>

          {/* Spinner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ position: 'relative', width: 56, height: 56, marginBottom: 28 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                border: '3px solid transparent',
                borderTopColor: '#d4f500', borderRightColor: 'rgba(212,245,0,0.3)',
              }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute', inset: 10, borderRadius: '50%',
                border: '2px solid transparent', borderTopColor: 'rgba(212,245,0,0.5)',
              }}
            />
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{ position: 'absolute', inset: 20, borderRadius: '50%', background: '#d4f500' }}
            />
          </motion.div>

          {/* Loading text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ color: '#4a4a2a', fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, margin: 0 }}
          >
            Loading...
          </motion.p>

          {/* Bottom progress bar */}
          <motion.div
            style={{ position: 'absolute', bottom: 0, left: 0, height: 3, background: 'linear-gradient(to right, #d4f500, #a8c400)' }}
            initial={{ width: '0%' }}
            animate={{ width: isLoading ? '80%' : '100%' }}
            transition={{ duration: isLoading ? 2 : 0.3, ease: 'easeOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoader;
