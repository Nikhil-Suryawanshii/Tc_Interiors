// PATH: frontend/src/components/common/WhatsAppButton.jsx
// Floating WhatsApp button — bottom right corner
// Config: set your number in Admin → Settings → whatsappNumber
// Falls back to VITE_WHATSAPP_NUMBER env var

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@contexts/SiteSettingsContext';

export default function WhatsAppButton() {
  const { settings } = useSettings();
  const [show, setShow]     = useState(false);
  const [tooltip, setTooltip] = useState(false);
  const [pulse, setPulse]   = useState(false);

  // Get number from settings or env
  const rawNumber = settings?.whatsappNumber
    || import.meta.env.VITE_WHATSAPP_NUMBER
    || '';

  // Clean number — remove spaces, dashes, plus
  const number = rawNumber.replace(/[^0-9]/g, '');

  // Pre-filled message
  const name     = settings?.ownerName || 'there';
  const message  = encodeURIComponent(
    `Hi ${name}! I visited your portfolio and I'd love to connect. 🚀`
  );
  const waUrl = `https://wa.me/${number}?text=${message}`;

  // Show after 3s, pulse after 8s to draw attention
  useEffect(() => {
    const t1 = setTimeout(() => setShow(true), 3000);
    const t2 = setTimeout(() => { setPulse(true); setTimeout(() => setPulse(false), 3000); }, 8000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Don't render if no number configured
  if (!number) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9990 }}
        >
          {/* Tooltip */}
          <AnimatePresence>
            {tooltip && (
              <motion.div
                initial={{ opacity: 0, x: 10, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute', right: 60, bottom: 8,
                  background: '#111827', color: '#f9fafb',
                  padding: '8px 14px', borderRadius: 10, fontSize: 13,
                  fontWeight: 500, whiteSpace: 'nowrap',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  pointerEvents: 'none',
                }}
              >
                Chat with me on WhatsApp!
                {/* Arrow */}
                <span style={{
                  position: 'absolute', right: -6, top: '50%', transform: 'translateY(-50%)',
                  width: 0, height: 0,
                  borderTop: '6px solid transparent',
                  borderBottom: '6px solid transparent',
                  borderLeft: '6px solid #111827',
                }} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pulse ring */}
          {pulse && (
            <motion.div
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 1.2, repeat: 2 }}
              style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                background: '#25D366', pointerEvents: 'none',
              }}
            />
          )}

          {/* Button */}
          <motion.a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.93 }}
            onMouseEnter={() => setTooltip(true)}
            onMouseLeave={() => setTooltip(false)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 56, height: 56, borderRadius: '50%',
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
              boxShadow: '0 6px 24px rgba(37,211,102,0.45)',
              color: '#fff',
            }}
            aria-label="Chat on WhatsApp"
          >
            {/* WhatsApp icon SVG */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
