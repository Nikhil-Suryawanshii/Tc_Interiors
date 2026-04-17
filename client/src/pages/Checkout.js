import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../utils/api';
import toast from 'react-hot-toast';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: user?.name||'', email:'', phone:'', line1:'', line2:'', city:'', state:'', pincode:'', paymentMethod:'COD' });

  const shipping = cartTotal > 50000 ? 0 : 2500;
  const tax = Math.round(cartTotal * 0.18);
  const total = cartTotal + shipping + tax;

  const handleChange = e => setForm(p=>({...p,[e.target.name]:e.target.value}));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!user) { toast.error('Please login to place an order'); navigate('/login'); return; }
    setLoading(true);
    try {
      const items = cartItems.map(i=>({ product:i._id, name:i.name, image:i.images?.[0]||'', price:i.discountPrice||i.price, quantity:i.quantity, color:i.color||'' }));
      const res = await createOrder({ items, shippingAddress:{ name:form.name, phone:form.phone, line1:form.line1, line2:form.line2, city:form.city, state:form.state, pincode:form.pincode }, paymentMethod:form.paymentMethod, itemsPrice:cartTotal, shippingPrice:shipping, taxPrice:tax, totalPrice:total });
      clearCart();
      navigate(`/order-success/${res.data._id}`);
    } catch(err) { toast.error(err.response?.data?.message||'Order failed'); } finally { setLoading(false); }
  };

  if (!cartItems.length) { navigate('/cart'); return null; }

  return (
    <div className="checkout-page">
      <div className="page-hero"><div className="container"><span className="section-label">Final Step</span><h1>Checkout</h1></div></div>
      <div className="container checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Contact Information</h3>
            <div className="form-grid">
              <div className="form-group"><label>Full Name *</label><input name="name" value={form.name} onChange={handleChange} required/></div>
              <div className="form-group"><label>Email *</label><input name="email" type="email" value={form.email} onChange={handleChange} required/></div>
              <div className="form-group"><label>Phone *</label><input name="phone" value={form.phone} onChange={handleChange} required/></div>
            </div>
          </div>
          <div className="form-section">
            <h3>Delivery Address</h3>
            <div className="form-grid">
              <div className="form-group full"><label>Address Line 1 *</label><input name="line1" value={form.line1} onChange={handleChange} required/></div>
              <div className="form-group full"><label>Address Line 2</label><input name="line2" value={form.line2} onChange={handleChange}/></div>
              <div className="form-group"><label>City *</label><input name="city" value={form.city} onChange={handleChange} required/></div>
              <div className="form-group"><label>State *</label><input name="state" value={form.state} onChange={handleChange} required/></div>
              <div className="form-group"><label>Pincode *</label><input name="pincode" value={form.pincode} onChange={handleChange} required/></div>
            </div>
          </div>
          <div className="form-section">
            <h3>Payment Method</h3>
            <div className="payment-options">
              {[['COD','Cash on Delivery'],['Online','Online Payment'],['UPI','UPI Payment']].map(([v,l])=>(
                <label key={v} className={`payment-option ${form.paymentMethod===v?'active':''}`}>
                  <input type="radio" name="paymentMethod" value={v} checked={form.paymentMethod===v} onChange={handleChange}/>
                  <span>{l}</span>
                </label>
              ))}
            </div>
          </div>
          <button type="submit" className="btn-primary place-order-btn" disabled={loading}>
            {loading ? 'Placing Order...' : `Place Order · ₹${total.toLocaleString()}`}
          </button>
        </form>

        <div className="order-summary-sidebar">
          <h3>Your Order</h3>
          {cartItems.map((item,i)=>(
            <div key={i} className="order-item">
              <span className="order-qty">{item.quantity}×</span>
              <span className="order-name">{item.name}</span>
              <span className="order-price">₹{((item.discountPrice||item.price)*item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="order-divider"/>
          <div className="order-line"><span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span></div>
          <div className="order-line"><span>Shipping</span><span>{shipping===0?'Free':`₹${shipping.toLocaleString()}`}</span></div>
          <div className="order-line"><span>GST (18%)</span><span>₹{tax.toLocaleString()}</span></div>
          <div className="order-total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
        </div>
      </div>
    </div>
  );
};
export default Checkout;
