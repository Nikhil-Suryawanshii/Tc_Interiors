import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Nav from '@components/common/Nav';
import Footer from '@components/common/Footer';
import SEO from '@components/common/SEO';
import { useGallery } from '@hooks/useQueries';
import { usePageTracking } from '@hooks/useAnalytics';

export default function GalleryPage() {
  const { data: gallery = [], isLoading } = useGallery();
  const [filter, setFilter] = useState('all');
  const [lightbox, setLb]   = useState(null);
  usePageTracking();

  const categories = ['all', ...Array.from(new Set(gallery.map(g=>g.category).filter(Boolean)))];
  const filtered   = filter==='all' ? gallery : gallery.filter(g=>g.category===filter);

  const next = () => setLb(i => (i+1)%filtered.length);
  const prev = () => setLb(i => (i-1+filtered.length)%filtered.length);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      <SEO page="gallery" title="Gallery" description="Explore our portfolio of stunning interior design projects." />
      <Nav/>

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-amber-700 dark:text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">Our Portfolio</div>
            <h1 className="text-4xl font-black">Interior Gallery</h1>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map(cat=>(
              <button key={cat} onClick={()=>setFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all capitalize ${filter===cat?'bg-amber-700 text-white':'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-amber-400'}`}>
                {cat}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({length:8}).map((_,i)=><div key={i} className="aspect-square rounded-2xl bg-stone-200 dark:bg-stone-800 animate-pulse"/>)}
            </div>
          ) : filtered.length===0 ? (
            <div className="text-center py-24 text-stone-400">
              <div className="text-5xl mb-4">🖼️</div>
              <p className="text-lg font-semibold">No gallery items yet</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.div layout className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {filtered.map((item,i)=>(
                  <motion.div key={item._id} layout initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
                    onClick={()=>setLb(i)}
                    className="relative overflow-hidden rounded-2xl cursor-pointer group break-inside-avoid mb-4">
                    <img src={item.image?.url} alt={item.title} className="w-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-end p-4">
                      <div className="translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="text-white font-bold text-sm">{item.title}</div>
                        {item.category && <div className="text-stone-300 text-xs">{item.category}</div>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div key="lb" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-[9998] bg-black/95 flex items-center justify-center p-4"
            onClick={()=>setLb(null)}>
            <button onClick={e=>{e.stopPropagation();prev();}} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"><FiChevronLeft size={24}/></button>
            <motion.img key={lightbox} src={filtered[lightbox]?.image?.url} alt={filtered[lightbox]?.title}
              initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
              onClick={e=>e.stopPropagation()}
              className="max-h-[85vh] max-w-full object-contain rounded-xl shadow-2xl"/>
            <button onClick={e=>{e.stopPropagation();next();}} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"><FiChevronRight size={24}/></button>
            <button onClick={()=>setLb(null)} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"><FiX size={20}/></button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">{filtered[lightbox]?.title}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer/>
    </div>
  );
}
