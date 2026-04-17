import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || []; }
    catch { return []; }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, color = '') => {
    setCartItems(prev => {
      const existing = prev.find(i => i._id === product._id && i.color === color);
      if (existing) {
        return prev.map(i => i._id === product._id && i.color === color
          ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { ...product, quantity, color }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id, color = '') => {
    setCartItems(prev => prev.filter(i => !(i._id === id && i.color === color)));
  };

  const updateQuantity = (id, quantity, color = '') => {
    if (quantity < 1) return removeFromCart(id, color);
    setCartItems(prev => prev.map(i => i._id === id && i.color === color ? { ...i, quantity } : i));
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + (i.discountPrice || i.price) * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems, cartCount, cartTotal,
      addToCart, removeFromCart, updateQuantity, clearCart,
      isCartOpen, setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
