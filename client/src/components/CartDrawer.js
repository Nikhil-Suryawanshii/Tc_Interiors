import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiX, FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import './CartDrawer.css';

const BASE_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

const CartDrawer = () => {
  const { cartItems, cartTotal, cartCount, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity } = useCart();

  return (
    <>
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)} />
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <div>
            <h3>Shopping Cart</h3>
            <span className="cart-count">{cartCount} item{cartCount !== 1 ? 's' : ''}</span>
          </div>
          <button className="close-btn" onClick={() => setIsCartOpen(false)}><FiX size={20} /></button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty</p>
              <Link to="/shop" className="btn-outline" onClick={() => setIsCartOpen(false)}>Browse Shop</Link>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div className="cart-item" key={`${item._id}-${item.color}-${idx}`}>
                <div className="item-image">
                  {item.images?.[0] ? (
                    <img src={item.images[0].startsWith('http') ? item.images[0] : `${BASE_URL}${item.images[0]}`}
                      alt={item.name} />
                  ) : <div className="img-placeholder" />}
                </div>
                <div className="item-info">
                  <h4>{item.name}</h4>
                  {item.color && <span className="item-color">{item.color}</span>}
                  <div className="item-price">₹{((item.discountPrice || item.price) * item.quantity).toLocaleString()}</div>
                  <div className="qty-controls">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1, item.color)}><FiMinus size={12} /></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1, item.color)}><FiPlus size={12} /></button>
                  </div>
                </div>
                <button className="remove-btn" onClick={() => removeFromCart(item._id, item.color)}><FiTrash2 size={14} /></button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>
            <p className="cart-note">Shipping & taxes calculated at checkout</p>
            <Link to="/checkout" className="btn-primary checkout-btn" onClick={() => setIsCartOpen(false)}>
              Proceed to Checkout
            </Link>
            <Link to="/cart" className="btn-outline view-cart-btn" onClick={() => setIsCartOpen(false)}>
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
