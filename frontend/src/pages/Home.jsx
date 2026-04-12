// TC Interior — Home Page
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiPhone, FiMail, FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Nav from '@components/common/Nav';
import Footer from '@components/common/Footer';
import SEO from '@components/common/SEO';
import { useProducts, useCategories, useTestimonials, useGallery } from '@hooks/useQueries';
import { usePageTracking } from '@hooks/useAnalytics';
import { useSettings } from '@contexts/SiteSettingsContext';
import { useCart } from '@contexts/CartContext';
import { SectionReveal, CountUp } from '@components/common/AnimationKit';
import toast from 'react-hot-toast';

const HERO_SLIDES = [
  { title: 'Transform Your Living Space', sub: 'Premium furniture & bespoke interior solutions', bg: 'from-stone-900 to-amber-950' },
  { title: 'Crafted With Excellence', sub: 'Every piece tells a story of quality and passion', bg: 'from-zinc-900 to-stone-800' },
  { title: 'Your Dream Home Awaits', sub: 'Explore our curated collection of luxury interiors', bg: 'from-amber-950 to-stone-900' },
];

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const { settings }      = useSettings();
  const { addItem }       = useCart();
  const { data: catData }       = useCategories();
  const { data: featData }      = useProducts({ featured: true, limit: 6 });
  const { data: testimonials=[] }= useTestimonials();
  const { data: gallery=[] }    = useGallery({ featured: true, limit: 6 });
  usePageTracking();

  const categories    = catData || [];
  const featProducts  = featData?.products || [];

  const addToCart = (product) => {
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 overflow-x-hidden">
      <SEO page="home" title="Luxury Interior Design & Furniture" description="Transform your living space with TC Interior's premium furniture and bespoke interior design solutions." />
      <Nav />

      {/* ── HERO CAROUSEL ─────────────────────────────── */}
      <section className="relative h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={slide} initial={{ opacity:0, scale:1.05 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
            transition={{ duration:0.8 }}
            className={`absolute inset-0 bg-gradient-to-br ${HERO_SLIDES[slide].bg} flex items-center justify-center`}>
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage:'url("https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&auto=format&fit=crop")', backgroundSize:'cover', backgroundPosition:'center' }} />
            <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
              <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2, duration:0.8 }}
                className="inline-flex items-center gap-2 px-4 py-2 border border-amber-400/40 rounded-full text-amber-300 text-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> Premium Interior Design
              </motion.div>
              <motion.h1 initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3, duration:0.9, ease:[0.16,1,0.3,1] }}
                className="text-5xl lg:text-7xl font-black text-white leading-tight tracking-tight mb-6">
                {HERO_SLIDES[slide].title}
              </motion.h1>
              <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
                className="text-xl text-stone-300 max-w-xl mx-auto mb-10">
                {HERO_SLIDES[slide].sub}
              </motion.p>
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.7 }} className="flex justify-center gap-4 flex-wrap">
                <Link to="/products" className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-colors shadow-xl shadow-amber-900/40">
                  Explore Collection
                </Link>
                <Link to="/contact" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 transition-colors backdrop-blur-sm">
                  Get Free Consultation
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
        {/* Arrows */}
        <button onClick={()=>setSlide(s=>(s-1+HERO_SLIDES.length)%HERO_SLIDES.length)} className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full text-white transition-all"><FiChevronLeft size={22}/></button>
        <button onClick={()=>setSlide(s=>(s+1)%HERO_SLIDES.length)} className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full text-white transition-all"><FiChevronRight size={22}/></button>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {HERO_SLIDES.map((_,i)=><button key={i} onClick={()=>setSlide(i)} className={`rounded-full transition-all ${i===slide?'w-8 h-2 bg-amber-400':'w-2 h-2 bg-white/40'}`}/>)}
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────── */}
      <section className="py-16 bg-amber-900 text-white">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[['500','Happy Clients'],['12','Years Experience'],['1000','Projects Done'],['50','Design Awards']].map(([n,l])=>(
            <div key={l}><div className="text-4xl font-black text-amber-300"><CountUp to={parseInt(n)} suffix="+" /></div><div className="text-sm text-amber-200 mt-1">{l}</div></div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <SectionReveal className="text-center mb-16">
              <div className="text-amber-700 dark:text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">Our Collections</div>
              <h2 className="text-4xl font-black text-stone-900 dark:text-white">Shop by Category</h2>
            </SectionReveal>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((cat,i)=>(
                <motion.div key={cat._id} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.06 }} whileHover={{ y:-6 }}>
                  <Link to={`/products?category=${cat._id}`} className="block group relative overflow-hidden rounded-2xl aspect-square bg-stone-100 dark:bg-stone-800">
                    {cat.image?.url
                      ? <img src={cat.image.url} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : <div className="w-full h-full flex items-center justify-center text-5xl">{cat.icon||'🪑'}</div>
                    }
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="text-white font-bold text-lg">{cat.name}</div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED PRODUCTS ─────────────────────────── */}
      {featProducts.length > 0 && (
        <section className="py-24 px-4 bg-stone-50 dark:bg-stone-900">
          <div className="max-w-7xl mx-auto">
            <SectionReveal className="text-center mb-16">
              <div className="text-amber-700 dark:text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">Bestsellers</div>
              <h2 className="text-4xl font-black text-stone-900 dark:text-white">Featured Products</h2>
            </SectionReveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featProducts.map((p,i)=>(
                <motion.div key={p._id} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.08 }} whileHover={{ y:-8 }}
                  className="bg-white dark:bg-stone-800 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-700 shadow-sm group">
                  <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                    {p.images?.[0]?.url
                      ? <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : <div className="w-full h-full flex items-center justify-center text-6xl">🪑</div>
                    }
                    {p.isNew && <span className="absolute top-3 left-3 px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-lg">NEW</span>}
                    {p.isBestseller && <span className="absolute top-3 right-3 px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-lg">⭐ BESTSELLER</span>}
                  </div>
                  <div className="p-5">
                    <div className="text-xs text-amber-700 dark:text-amber-400 font-semibold uppercase tracking-wider mb-1">{p.category?.name}</div>
                    <h3 className="font-bold text-stone-900 dark:text-white mb-2 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">{p.name}</h3>
                    <p className="text-stone-500 dark:text-stone-400 text-sm mb-4 line-clamp-2">{p.shortDesc||p.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg text-stone-900 dark:text-white">
                        {p.priceOnRequest ? 'Price on Request' : p.price > 0 ? `₹${p.price.toLocaleString()}` : 'Contact Us'}
                      </span>
                      <div className="flex gap-2">
                        <button onClick={()=>addToCart(p)} className="px-3 py-2 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 rounded-lg text-sm font-semibold hover:bg-amber-200 transition-colors">+ Cart</button>
                        <Link to={`/products/${p.slug}`} className="px-3 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold transition-colors">View</Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center">
              <Link to="/products" className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-amber-700 text-amber-700 dark:text-amber-400 dark:border-amber-500 font-bold rounded-xl hover:bg-amber-700 hover:text-white transition-all">
                View All Products <FiArrowRight />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── GALLERY PREVIEW ───────────────────────────── */}
      {gallery.length > 0 && (
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <SectionReveal className="text-center mb-16">
              <div className="text-amber-700 dark:text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">Our Work</div>
              <h2 className="text-4xl font-black text-stone-900 dark:text-white">Interior Gallery</h2>
            </SectionReveal>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {gallery.slice(0,6).map((item,i)=>(
                <motion.div key={item._id} initial={{ opacity:0, scale:0.95 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ delay:i*0.06 }}
                  className={`relative overflow-hidden rounded-2xl ${i===0?'md:col-span-2 md:row-span-2':''} group cursor-pointer`}
                  style={{ aspectRatio: i===0?'16/9':'4/3' }}>
                  <img src={item.image?.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end p-4">
                    <div className="translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="text-white font-bold">{item.title}</div>
                      {item.category && <div className="text-stone-300 text-sm">{item.category}</div>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/gallery" className="inline-flex items-center gap-2 px-8 py-3.5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold rounded-xl hover:opacity-90 transition-all">
                View Full Gallery <FiArrowRight />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── TESTIMONIALS ──────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="py-24 px-4 bg-amber-900 text-white">
          <div className="max-w-6xl mx-auto">
            <SectionReveal className="text-center mb-16">
              <div className="text-amber-300 text-sm font-semibold tracking-widest uppercase mb-3">Client Love</div>
              <h2 className="text-4xl font-black">What Our Clients Say</h2>
            </SectionReveal>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0,3).map((t,i)=>(
                <motion.div key={t._id} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}
                  className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10">
                  <div className="flex gap-1 mb-4">{Array.from({length:t.rating||5}).map((_,j)=><FiStar key={j} size={14} className="text-amber-400 fill-amber-400"/>)}</div>
                  <p className="text-stone-200 italic mb-4">"{t.quote}"</p>
                  <div className="font-bold">{t.name}</div>
                  {t.role && <div className="text-amber-300 text-sm">{t.role}{t.company?` · ${t.company}`:''}</div>}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <SectionReveal>
            <h2 className="text-4xl font-black text-stone-900 dark:text-white mb-4">Ready to Transform Your Space?</h2>
            <p className="text-stone-500 dark:text-stone-400 text-lg mb-8">Get a free consultation with our interior design experts today.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors shadow-xl shadow-amber-900/30">
                <FiMail size={18}/> Get Free Consultation
              </Link>
              {settings?.phone && <a href={`tel:${settings.phone}`} className="inline-flex items-center gap-2 px-8 py-4 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-white font-bold rounded-xl transition-colors">
                <FiPhone size={18}/> {settings.phone}
              </a>}
            </div>
          </SectionReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
