import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowLeft, FiSend } from 'react-icons/fi';
import Nav from '@components/common/Nav';
import Footer from '@components/common/Footer';
import SEO from '@components/common/SEO';
import { useCart } from '@contexts/CartContext';
import { enquiriesAPI } from '@services/api';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, removeItem, setQty, clearCart, totalItems } = useCart();
  const [form, setForm]   = useState({ name:'', email:'', phone:'', message:'' });
  const [sending, setSending] = useState(false);
  const [sent, setSent]   = useState(false);

  const sendEnquiry = async (e) => {
    e.preventDefault();
    if (!form.name||!form.email) return;
    setSending(true);
    try {
      await enquiriesAPI.submit({
        ...form,
        type: 'cart',
        cartItems: items.map(i => ({ productId:i._id, productName:i.name, quantity:i.qty, priceUnit:i.priceUnit })),
        message: form.message || `Cart enquiry for ${items.length} item(s)`,
      });
      setSent(true);
      clearCart();
      toast.success('Enquiry sent! We\'ll get back to you soon.');
    } catch { toast.error('Failed to send. Please try again.'); }
    setSending(false);
  };

  if (items.length === 0 && !sent) return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      <SEO title="Cart" description="Your shopping cart" noIndex />
      <Nav/>
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <FiShoppingBag size={64} className="text-stone-300 dark:text-stone-700 mb-6"/>
        <h1 className="text-3xl font-black mb-3">Your cart is empty</h1>
        <p className="text-stone-500 mb-8 text-center max-w-sm">Add some products to your cart and send us an enquiry for pricing and availability.</p>
        <Link to="/products" className="px-8 py-3.5 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors">Browse Products</Link>
      </div>
      <Footer/>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      <SEO title="Cart" description="Your shopping cart" noIndex />
      <Nav/>

      <div className="max-w-6xl mx-auto px-4 pt-28 pb-16">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/products" className="text-stone-500 hover:text-amber-700 transition-colors"><FiArrowLeft size={20}/></Link>
          <h1 className="text-3xl font-black">Your Cart <span className="text-amber-700">({totalItems})</span></h1>
        </div>

        {sent ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-black mb-3">Enquiry Sent!</h2>
            <p className="text-stone-500 max-w-md mx-auto mb-8">Thank you! Our team will review your cart and contact you within 24 hours with pricing and availability details.</p>
            <Link to="/products" className="px-8 py-3.5 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors">Continue Shopping</Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map(item => (
                  <motion.div key={item._id}
                    initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:20, height:0 }}
                    className="flex gap-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl p-4">
                    <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-stone-100">
                      {item.images?.[0]?.url ? <img src={item.images[0].url} alt={item.name} className="w-full h-full object-cover"/>
                        : <div className="w-full h-full flex items-center justify-center text-3xl">🪑</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-stone-900 dark:text-white">{item.name}</div>
                      <div className="text-sm text-stone-500 mb-3">{item.category?.name}</div>
                      <div className="flex items-center gap-4 flex-wrap">
                        {/* Qty control */}
                        <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-700 rounded-xl p-1">
                          <button onClick={()=>setQty(item._id,item.qty-1)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-stone-600 transition-colors"><FiMinus size={13}/></button>
                          <span className="w-6 text-center text-sm font-bold">{item.qty}</span>
                          <button onClick={()=>setQty(item._id,item.qty+1)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-stone-600 transition-colors"><FiPlus size={13}/></button>
                        </div>
                        <span className="text-sm text-stone-500">
                          {item.priceOnRequest ? 'Price on Request' : item.price>0 ? `₹${(item.price*item.qty).toLocaleString()}` : 'Contact for Price'}
                        </span>
                        <button onClick={()=>removeItem(item._id)} className="ml-auto p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><FiTrash2 size={16}/></button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <div className="flex justify-between pt-2">
                <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 font-medium">Clear Cart</button>
                <Link to="/products" className="text-sm text-amber-700 hover:text-amber-600 font-medium flex items-center gap-1"><FiArrowLeft size={13}/> Continue Shopping</Link>
              </div>
            </div>

            {/* Enquiry Form */}
            <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl p-6 h-fit sticky top-24">
              <h2 className="text-xl font-black mb-1">Send Enquiry</h2>
              <p className="text-stone-500 text-sm mb-5">We'll confirm pricing & availability within 24 hours.</p>

              {/* Cart summary */}
              <div className="bg-stone-50 dark:bg-stone-900 rounded-xl p-3 mb-5 space-y-1.5">
                {items.map(i=>(
                  <div key={i._id} className="flex justify-between text-sm">
                    <span className="text-stone-600 dark:text-stone-400 truncate flex-1 mr-2">{i.name} ×{i.qty}</span>
                    <span className="text-stone-900 dark:text-white font-medium flex-shrink-0">
                      {i.priceOnRequest?'On Request':i.price>0?`₹${(i.price*i.qty).toLocaleString()}`:'—'}
                    </span>
                  </div>
                ))}
              </div>

              <form onSubmit={sendEnquiry} className="space-y-3">
                {[['Name *','name','text',true],['Email *','email','email',true],['Phone','phone','tel',false]].map(([label,field,type,req])=>(
                  <div key={field}>
                    <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">{label}</label>
                    <input type={type} required={req} value={form[field]} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))}
                      className="w-full px-3 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none focus:border-amber-400"/>
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Message (optional)</label>
                  <textarea rows={3} value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} placeholder="Any specific requirements, customizations..."
                    className="w-full px-3 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none focus:border-amber-400 resize-none"/>
                </div>
                <button type="submit" disabled={sending||items.length===0}
                  className="w-full py-3 bg-amber-700 hover:bg-amber-600 disabled:opacity-60 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                  <FiSend size={16}/>{sending?'Sending...':'Send Cart Enquiry'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}
