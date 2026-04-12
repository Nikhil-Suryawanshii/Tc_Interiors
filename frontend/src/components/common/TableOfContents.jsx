// PATH: frontend/src/components/common/TableOfContents.jsx
// Sticky sidebar TOC for blog posts
// Auto-extracts h2/h3 from rendered HTML content
// Active heading highlights as you scroll

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function slugify(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

function extractHeadings(html = '') {
  const div = document.createElement('div');
  div.innerHTML = html;
  const nodes = div.querySelectorAll('h2, h3');
  return Array.from(nodes).map(node => ({
    id:    slugify(node.textContent),
    text:  node.textContent,
    level: parseInt(node.tagName[1]),
  }));
}

export default function TableOfContents({ content = '', className = '' }) {
  const [headings, setHeadings]     = useState([]);
  const [activeId, setActiveId]     = useState('');
  const [isOpen, setIsOpen]         = useState(true);
  const observerRef = useRef(null);

  // Extract headings from content
  useEffect(() => {
    if (!content) return;
    const h = extractHeadings(content);
    setHeadings(h);
  }, [content]);

  // Add IDs to actual DOM headings and observe them
  useEffect(() => {
    if (!headings.length) return;

    // Add IDs to DOM headings
    const article = document.querySelector('article, .blog-content, .prose');
    if (!article) return;

    article.querySelectorAll('h2, h3').forEach(node => {
      const id = slugify(node.textContent);
      node.id = id;
    });

    // IntersectionObserver to track active heading
    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-20% 0% -70% 0%', threshold: 0 }
    );

    article.querySelectorAll('h2[id], h3[id]').forEach(el => {
      observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [headings]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (headings.length < 2) return null;

  return (
    <div className={`${className}`}>
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(99,102,241,0.15)',
        borderRadius: 16, overflow: 'hidden',
      }}>
        {/* Header */}
        <button
          onClick={() => setIsOpen(v => !v)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px', background: 'none', border: 'none',
            cursor: 'pointer', color: '#e2e8f0',
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6366f1' }}>
            On this page
          </span>
          <motion.span animate={{ rotate: isOpen ? 0 : -90 }} transition={{ duration: 0.2 }}
            style={{ fontSize: 16, color: '#6b7280' }}>
            ▾
          </motion.span>
        </button>

        {/* Links */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ padding: '0 18px 16px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                {headings.map(h => (
                  <button
                    key={h.id}
                    onClick={() => scrollTo(h.id)}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: `6px 0 6px ${h.level === 3 ? '14px' : '0'}`,
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: h.level === 2 ? 13 : 12,
                      fontWeight: activeId === h.id ? 600 : 400,
                      color: activeId === h.id ? '#a78bfa' : '#94a3b8',
                      borderLeft: activeId === h.id ? '2px solid #6366f1' : '2px solid transparent',
                      paddingLeft: h.level === 3 ? 14 : 8,
                      transition: 'all 0.15s',
                      lineHeight: 1.4,
                    }}
                  >
                    {h.text}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
