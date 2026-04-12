import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiGrid, FiList, FiShoppingCart, FiFilter } from 'react-icons/fi';
import Nav from '@components/common/Nav';
import Footer from '@components/common/Footer';
import SEO from '@components/common/SEO';
import { useProducts, useCategories } from '@hooks/useQueries';
import { usePageTracking } from '@hooks/useAnalytics';
import { useCart } from '@contexts/CartContext';
import toast from 'react-hot-toast';

const useTilt = (s=8) => {
  const { useRef } = require('react');
  const ref = useRef(null);
  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX-r.left)/r.width-0.5)*s;
    const y = ((e.clientY-r.top)/r.height-0.5)*s;
    ref.current.style.transform = `perspective(700px) rotateY(${x}deg) rotateX(${-y}deg) scale3d(1.03,1.03,1.03)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = 'perspective(700px) rotateY(0) rotateX(0) scale3d(1,1,1)'; };
  return { ref, onMouseMove:onMove, onMouseLeave:onLeave };
};

function ProductCard({ product, view }) {
  const { addItem } = useCart();
  const tilt = view==='grid' ? useTilt(6) : { ref:null, onMouseMove:null, onMouseLeave:null };
  const img = product.images?.find(i=>i.isPrimary)||product.images?.[0];

  const add = () => { addItem(product); toast.success(`${product.name} added!`); };

  if (view==='list') return (
    <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} layout
      className="flex gap-5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl p-4 group hover:border-amber-300 dark:hover:border-amber-600 transition-colors">
      <div className="w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-stone-100">
        {img?.url ? <img src={img.url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/> : <div className="w-full h-full flex items-center justify-center text-4xl">🪑</div>}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-amber-700 dark:text-amber-400 font-semibold uppercase tracking-wider mb-1">{product.category?.name}</div>
        <h3 className="font-bold text-stone-900 dark:text-white mb-1 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">{product.name}</h3>
        <p className="text-stone-500 text-sm line-clamp-2 mb-3">{product.shortDesc||product.description}</p>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-bold text-stone-900 dark:text-white">{product.priceOnRequest?'Price on Request':product.price>0?`₹${product.price.toLocaleString()}`:'Contact Us'}</span>
          <button onClick={add} className="px-3 py-1.5 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 rounded-lg text-sm font-semibold hover:bg-amber-200 transition-colors flex items-center gap-1"><FiShoppingCart size={13}/> Add to Cart</button>
          <Link to={`/products/${product.slug}`} className="px-3 py-1.5 bg-amber-700 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition-colors">View Details</Link>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div ref={tilt.ref} onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave}
      initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} layout
      style={{ transformStyle:'preserve-3d', transition:'transform 0.15s ease' }}
      className="bg-white dark:bg-stone-800 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-700 shadow-sm group hover:border-amber-300 dark:hover:border-amber-600 transition-colors">
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        {img?.url ? <img src={img.url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/> : <div className="w-full h-full flex items-center justify-center text-6xl">🪑</div>}
        {product.isNew && <span className="absolute top-3 left-3 px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-lg">NEW</span>}
        {!product.inStock && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-white font-bold bg-black/60 px-4 py-2 rounded-lg">Out of Stock</span></div>}
      </div>
      <div className="p-4">
        <div className="text-xs text-amber-700 dark:text-amber-400 font-semibold uppercase tracking-wider mb-1">{product.category?.name}</div>
        <h3 className="font-bold text-stone-900 dark:text-white mb-1 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors line-clamp-1">{product.name}</h3>
        <p className="text-stone-500 text-sm mb-3 line-clamp-2 h-10">{product.shortDesc||product.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-stone-900 dark:text-white text-sm">{product.priceOnRequest?'On Request':product.price>0?`₹${product.price.toLocaleString()}`:'Contact'}</span>
          <div className="flex gap-2">
            {product.inStock && <button onClick={add} className="p-2 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 rounded-lg hover:bg-amber-200 transition-colors"><FiShoppingCart size={14}/></button>}
            <Link to={`/products/${product.slug}`} className="px-3 py-2 bg-amber-700 text-white rounded-lg text-xs font-bold hover:bg-amber-600 transition-colors">View</Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProductsPage() {
  const [search, setSearch]   = useState('');
  const [catFilter, setCat]   = useState('');
  const [view, setView]       = useState('grid');
  const [sort, setSort]       = useState('order');
  const { data: catData }     = useCategories();
  const { data: prodData, isLoading } = useProducts({ category:catFilter||undefined, sort });
  usePageTracking();

  const categories = catData || [];
  const allProducts= prodData?.products || [];
  const filtered   = allProducts.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      <SEO page="products" title="Our Products" description="Browse TC Interior's full collection of premium furniture and interior accessories." />
      <Nav />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-amber-700 dark:text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">Our Collection</div>
            <h1 className="text-4xl font-black text-stone-900 dark:text-white">All Products</h1>
          </div>

          {/* Filters bar */}
          <div className="flex flex-wrap gap-3 mb-8 items-center">
            <div className="relative flex-1 min-w-60">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16}/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none focus:border-amber-400"/>
            </div>
            <select value={catFilter} onChange={e=>setCat(e.target.value)}
              className="px-4 py-2.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none">
              <option value="">All Categories</option>
              {categories.map(c=><option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <select value={sort} onChange={e=>setSort(e.target.value)}
              className="px-4 py-2.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none">
              <option value="order">Default</option>
              <option value="newest">Newest</option>
              <option value="name">Name A–Z</option>
            </select>
            <div className="flex gap-1 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl p-1">
              <button onClick={()=>setView('grid')} className={`p-2 rounded-lg transition-colors ${view==='grid'?'bg-amber-700 text-white':'text-stone-500 hover:text-stone-900'}`}><FiGrid size={16}/></button>
              <button onClick={()=>setView('list')} className={`p-2 rounded-lg transition-colors ${view==='list'?'bg-amber-700 text-white':'text-stone-500 hover:text-stone-900'}`}><FiList size={16}/></button>
            </div>
          </div>

          {/* Results */}
          <div className="text-sm text-stone-500 mb-4">{filtered.length} product{filtered.length!==1?'s':''} found</div>

          {isLoading ? (
            <div className={`grid ${view==='grid'?'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4':'grid-cols-1'} gap-6`}>
              {Array.from({length:8}).map((_,i)=><div key={i} className="rounded-2xl bg-stone-200 dark:bg-stone-800 animate-pulse" style={{height:view==='grid'?320:120}}/>)}
            </div>
          ) : filtered.length===0 ? (
            <div className="text-center py-24 text-stone-400">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-lg font-semibold">No products found</p>
              <button onClick={()=>{setSearch('');setCat('');}} className="mt-4 text-amber-700 underline text-sm">Clear filters</button>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className={`grid ${view==='grid'?'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4':'grid-cols-1'} gap-6`}>
                {filtered.map((p,i)=><ProductCard key={p._id} product={p} view={view}/>)}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
