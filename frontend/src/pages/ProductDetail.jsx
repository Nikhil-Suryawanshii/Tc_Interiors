import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiShoppingCart, FiPhone, FiMail, FiChevronLeft, FiChevronRight, FiCheck } from 'react-icons/fi';
import Nav from '@components/common/Nav';
import Footer from '@components/common/Footer';
import SEO from '@components/common/SEO';
import { useProduct, useProducts } from '@hooks/useQueries';
import { usePageTracking } from '@hooks/useAnalytics';
import { useCart } from '@contexts/CartContext';
import { enquiriesAPI } from '@services/api';
import { useSettings } from '@contexts/SiteSettingsContext';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { slug }         = useParams();
  const { data: product, isLoading } = useProduct(slug);
  const { settings }     = useSettings();
  const { addItem }      = useCart();
  const [imgIdx, setImg] = useState(0);
  const [form, setForm]  = useState({ name:'', email:'', phone:'', message:'' });
  const [sending, setSending] = useState(false);
  const [sent, setSent]  = useState(false);
  usePageTracking();

  const images = product?.images || [];

  const addToCart = () => { addItem(product); toast.success(`${product.name} added to cart!`); };

  const sendEnquiry = async (e) => {
    e.preventDefault();
    if (!form.name||!form.email) return;
    setSending(true);
    try {
      await enquiriesAPI.submit({ ...form, type:'product', product:product._id, productName:product.name });
      setSent(true);
      toast.success('Enquiry sent! We\'ll contact you soon.');
    } catch { toast.error('Failed to send. Please try again.'); }
    setSending(false);
  };

  if (isLoading) return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950"><Nav/>
      <div className="max-w-6xl mx-auto px-4 pt-32 grid md:grid-cols-2 gap-12">
        <div className="aspect-square bg-stone-200 dark:bg-stone-800 rounded-2xl animate-pulse"/>
        <div className="space-y-4">{Array.from({length:5}).map((_,i)=><div key={i} className={`h-${i===0?8:4} bg-stone-200 dark:bg-stone-800 rounded-xl animate-pulse ${i>1?'w-3/4':'w-full'}`}/>)}</div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center"><Nav/>
      <div className="text-5xl mb-4">🔍</div>
      <p className="text-xl font-bold text-stone-900 dark:text-white mb-4">Product not found</p>
      <Link to="/products" className="text-amber-700 underline">Back to Products</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      <SEO title={product.name} description={product.shortDesc||product.description?.slice(0,155)} image={images[0]?.url} type="product" />
      <Nav/>

      <div className="max-w-7xl mx-auto px-4 pt-28 pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-stone-500 mb-8">
          <Link to="/products" className="hover:text-amber-700 flex items-center gap-1"><FiArrowLeft size={14}/>Products</Link>
          <span>/</span><span>{product.category?.name}</span>
          <span>/</span><span className="text-stone-900 dark:text-white">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="relative aspect-square bg-stone-100 dark:bg-stone-800 rounded-2xl overflow-hidden mb-4">
              <AnimatePresence mode="wait">
                {images[imgIdx]?.url
                  ? <motion.img key={imgIdx} src={images[imgIdx].url} alt={product.name} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="w-full h-full object-cover"/>
                  : <div className="w-full h-full flex items-center justify-center text-8xl">🪑</div>
                }
              </AnimatePresence>
              {images.length>1 && <>
                <button onClick={()=>setImg(i=>(i-1+images.length)%images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-stone-900/80 backdrop-blur rounded-full hover:bg-white transition-colors"><FiChevronLeft/></button>
                <button onClick={()=>setImg(i=>(i+1)%images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-stone-900/80 backdrop-blur rounded-full hover:bg-white transition-colors"><FiChevronRight/></button>
              </>}
              {!product.inStock && <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold">Out of Stock</div>}
            </div>
            {images.length>1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img,i)=>(
                  <button key={i} onClick={()=>setImg(i)} className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${i===imgIdx?'border-amber-500':'border-transparent'}`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover"/>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="text-amber-700 dark:text-amber-400 text-sm font-bold uppercase tracking-widest mb-2">{product.category?.name}</div>
            <h1 className="text-3xl font-black text-stone-900 dark:text-white mb-3">{product.name}</h1>

            <div className="text-2xl font-bold text-stone-900 dark:text-white mb-6">
              {product.priceOnRequest ? 'Price on Request' : product.price>0 ? `₹${product.price.toLocaleString()} / ${product.priceUnit||'piece'}` : 'Contact for Price'}
            </div>

            {product.description && <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-6">{product.description}</p>}

            {/* Specs */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {product.materials?.length>0 && <div className="bg-stone-100 dark:bg-stone-800 rounded-xl p-3"><div className="text-xs text-stone-500 uppercase tracking-wider mb-1">Materials</div><div className="text-sm font-semibold">{product.materials.join(', ')}</div></div>}
              {product.colors?.length>0 && <div className="bg-stone-100 dark:bg-stone-800 rounded-xl p-3"><div className="text-xs text-stone-500 uppercase tracking-wider mb-1">Colors</div><div className="text-sm font-semibold">{product.colors.join(', ')}</div></div>}
              {product.finishes?.length>0 && <div className="bg-stone-100 dark:bg-stone-800 rounded-xl p-3"><div className="text-xs text-stone-500 uppercase tracking-wider mb-1">Finishes</div><div className="text-sm font-semibold">{product.finishes.join(', ')}</div></div>}
              {(product.dimensions?.length||product.dimensions?.width||product.dimensions?.height) && (
                <div className="bg-stone-100 dark:bg-stone-800 rounded-xl p-3"><div className="text-xs text-stone-500 uppercase tracking-wider mb-1">Dimensions</div>
                  <div className="text-sm font-semibold">{[product.dimensions.length&&`L:${product.dimensions.length}`,product.dimensions.width&&`W:${product.dimensions.width}`,product.dimensions.height&&`H:${product.dimensions.height}`].filter(Boolean).join(' × ')} {product.dimensions.unit||''}</div>
                </div>
              )}
            </div>

            {/* Features */}
            {product.features?.length>0 && (
              <div className="mb-6">
                <div className="font-bold mb-3">Key Features</div>
                <ul className="space-y-2">
                  {product.features.map((f,i)=>(
                    <li key={i} className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-400">
                      <FiCheck size={16} className="text-amber-600 mt-0.5 flex-shrink-0"/>  {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTAs */}
            <div className="flex gap-3 flex-wrap">
              {product.inStock && (
                <motion.button onClick={addToCart} whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                  className="flex-1 py-3.5 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
                  <FiShoppingCart size={18}/> Add to Cart
                </motion.button>
              )}
              <a href="#enquiry" className="flex-1 py-3.5 border-2 border-amber-700 text-amber-700 dark:text-amber-400 dark:border-amber-500 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-amber-700 hover:text-white transition-all">
                <FiMail size={18}/> Enquire Now
              </a>
            </div>
          </div>
        </div>

        {/* Enquiry Form */}
        <div id="enquiry" className="mt-16 max-w-2xl mx-auto">
          <div className="bg-white dark:bg-stone-800 rounded-2xl p-8 border border-stone-200 dark:border-stone-700 shadow-sm">
            <h2 className="text-2xl font-black mb-2">Enquire About This Product</h2>
            <p className="text-stone-500 mb-6 text-sm">Tell us your requirements and we'll get back within 24 hours.</p>
            {sent ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-3">✅</div>
                <p className="font-bold text-stone-900 dark:text-white">Enquiry Sent!</p>
                <p className="text-stone-500 text-sm mt-2">Our team will contact you soon.</p>
              </div>
            ) : (
              <form onSubmit={sendEnquiry} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Name *</label>
                    <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none focus:border-amber-400"/></div>
                  <div><label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Email *</label>
                    <input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none focus:border-amber-400"/></div>
                </div>
                <div><label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Phone</label>
                  <input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none focus:border-amber-400"/></div>
                <div><label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Message</label>
                  <textarea rows={4} value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} placeholder={`I'm interested in ${product.name}...`} className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none focus:border-amber-400 resize-none"/></div>
                <button type="submit" disabled={sending} className="w-full py-3.5 bg-amber-700 hover:bg-amber-600 disabled:opacity-60 text-white font-bold rounded-xl transition-colors">
                  {sending?'Sending...' : 'Send Enquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
