import React from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './Cart.css';

const BASE = process.env.REACT_APP_API_URL?.replace('/api','') || 'http://localhost:5000';

const Cart = () => {
  const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const shipping = cartTotal > 50000 ? 0 : 2500;
  const tax = Math.round(cartTotal * 0.18);
  const total = cartTotal + shipping + tax;

  if (!cartItems.length) return (
    <div className="cart-empty-page">
      <FiShoppingBag size={60} />
      <h2>Your cart is empty</h2>
      <p>Looks like you haven't added anything yet.</p>
      <Link to="/shop" className="btn-primary">Explore Shop <FiArrowRight/></Link>
    </div>
  );

  const imgUrl = src => src?.startsWith('http') ? src : `${BASE}${src}`;

  return (
    <div className="cart-page">
      <div className="page-hero"><div className="container"><span className="section-label">Shopping</span><h1>Your Cart</h1></div></div>
      <div className="container cart-layout">
        <div className="cart-items-col">
          <div className="cart-items-header">
            <span>{cartItems.length} item{cartItems.length!==1?'s':''}</span>
            <button onClick={clearCart} className="clear-all">Clear All</button>
          </div>
          {cartItems.map((item, i) => (
            <div key={`${item._id}-${item.color}-${i}`} className="cart-row">
              <div className="cart-row-img">
                {item.images?.[0] ? <img src={imgUrl(item.images[0])} alt={item.name}/> : <div className="img-ph"/>}
              </div>
              <div className="cart-row-info">
                <h3>{item.name}</h3>
                {item.color && <span className="item-attr">Color: {item.color}</span>}
                <div className="row-bottom">
                  <div className="qty-controls">
                    <button onClick={()=>updateQuantity(item._id,item.quantity-1,item.color)}><FiMinus size={12}/></button>
                    <span>{item.quantity}</span>
                    <button onClick={()=>updateQuantity(item._id,item.quantity+1,item.color)}><FiPlus size={12}/></button>
                  </div>
                  <span className="row-price">₹{((item.discountPrice||item.price)*item.quantity).toLocaleString()}</span>
                </div>
              </div>
              <button className="remove-row" onClick={()=>removeFromCart(item._id,item.color)}><FiTrash2 size={16}/></button>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-lines">
            <div className="summary-line"><span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span></div>
            <div className="summary-line"><span>Shipping</span><span>{shipping===0?'Free':`₹${shipping.toLocaleString()}`}</span></div>
            <div className="summary-line"><span>GST (18%)</span><span>₹{tax.toLocaleString()}</span></div>
            {cartTotal < 50000 && <p className="free-shipping-note">Add ₹{(50000-cartTotal).toLocaleString()} more for free shipping</p>}
          </div>
          <div className="summary-total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
          <Link to="/checkout" className="btn-primary checkout-btn">Proceed to Checkout <FiArrowRight/></Link>
          <Link to="/shop" className="btn-outline continue-btn">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};
export default Cart;
