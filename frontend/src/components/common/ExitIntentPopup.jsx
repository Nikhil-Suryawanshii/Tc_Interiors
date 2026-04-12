// PATH: frontend/src/components/common/ExitIntentPopup.jsx
// Shows when user moves mouse toward top of browser (about to close/switch tab)
// Also shows after 45s of inactivity — whichever comes first
// Only shows once per session

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMail, FiCalendar } from 'react-icons/fi';
import { useSettings } from '@contexts/SiteSettingsContext';

export default function ExitIntentPopup() {
  const [show, setShow]     = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { settings }        = useSettings();
  const shownRef = useRef(false);
  const timerRef = useRef(null);

  const trigger = () => {
    if (shownRef.current) return;
    // Only show on desktop, not admin pages
    if (window.location.pathname.startsWith('/admin')) return;
    // Only once per session
    if (sessionStorage.getItem('exit_popup_shown')) return;
    shownRef.current = true;
    sessionStorage.setItem('exit_popup_shown', '1');
    setShow(true);
  };

  useEffect(() => {
    // Exit intent: mouse near top of screen
    const onMouseMove = (e) => {
      if (e.clientY < 12 && e.movementY < -3) trigger();
    };

    // Fallback: 45s inactivity timer
    timerRef.current = setTimeout(trigger, 45000);

    document.addEventListener('mouseleave', trigger);
    document.addEventListener('mousemove', onMouseMove);

    return () => {
      clearTimeout(timerRef.current);
      document.removeEventListener('mouseleave', trigger);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  const close = () => {
    setShow(false);
    setDismissed(true);
  };

  const name     = settings?.ownerName || 'me';
  const calendly = settings?.calendlyUrl || '';
  const email    = settings?.contactEmail || '';

  return (
    <AnimatePresence>
      {show && !dismissed && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            style={{
              position: 'fixed', inset: 0, zIndex: 9994,
              background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
            }}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            style={{
              position: 'fixed', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 9995, width: '100%', maxWidth: 440,
              padding: '0 16px',
            }}
          >
            <div style={{
              background: 'linear-gradient(135deg, #0f0f1a, #131328)',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: 24, padding: '36px 32px',
              boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
              position: 'relative', textAlign: 'center',
            }}>
              {/* Close button */}
              <button onClick={close} style={{
                position: 'absolute', top: 16, right: 16,
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)', border: 'none',
                color: '#6b7280', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FiX size={16} />
              </button>

              {/* Emoji */}
              <div style={{ fontSize: 48, marginBottom: 16 }}>👋</div>

              {/* Heading */}
              <h2 style={{
                fontSize: 22, fontWeight: 800, color: '#f1f5f9',
                marginBottom: 10, lineHeight: 1.3,
              }}>
                Before you go...
              </h2>

              {/* Body */}
              <p style={{
                fontSize: 14, color: '#94a3b8', lineHeight: 1.7,
                marginBottom: 24,
              }}>
                I'm currently available for new projects. If you liked what you saw,
                let's have a quick 15-min chat — no commitments, just ideas.
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {calendly ? (
                  <a href={calendly} target="_blank" rel="noopener noreferrer"
                    onClick={close}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      padding: '13px 20px', borderRadius: 12, fontWeight: 700, fontSize: 14,
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      color: '#fff', textDecoration: 'none',
                      boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
                    }}>
                    <FiCalendar size={16} /> Schedule a Free Call
                  </a>
                ) : (
                  <a href="/contact" onClick={close}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      padding: '13px 20px', borderRadius: 12, fontWeight: 700, fontSize: 14,
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      color: '#fff', textDecoration: 'none',
                    }}>
                    <FiMail size={16} /> Send Me a Message
                  </a>
                )}

                <button onClick={close} style={{
                  padding: '11px 20px', borderRadius: 12, fontWeight: 500, fontSize: 13,
                  background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#6b7280', cursor: 'pointer',
                }}>
                  Maybe later
                </button>
              </div>

              {/* Social proof */}
              <p style={{ fontSize: 11, color: '#4b5563', marginTop: 20 }}>
                💬 Usually responds within 24 hours
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
