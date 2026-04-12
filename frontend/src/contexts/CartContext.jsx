// Cart stored in localStorage — no login required
import { createContext, useContext, useEffect, useReducer } from 'react';

const CartContext = createContext(null);

const load = () => {
  try { return JSON.parse(localStorage.getItem('tc_cart')) || []; }
  catch { return []; }
};

const save = (items) => {
  try { localStorage.setItem('tc_cart', JSON.stringify(items)); } catch {}
};

function cartReducer(state, action) {
  let next;
  switch (action.type) {
    case 'ADD': {
      const exists = state.find(i => i._id === action.item._id);
      if (exists) {
        next = state.map(i => i._id === action.item._id ? { ...i, qty: i.qty + 1 } : i);
      } else {
        next = [...state, { ...action.item, qty: 1 }];
      }
      break;
    }
    case 'REMOVE':
      next = state.filter(i => i._id !== action.id);
      break;
    case 'QTY':
      next = action.qty < 1
        ? state.filter(i => i._id !== action.id)
        : state.map(i => i._id === action.id ? { ...i, qty: action.qty } : i);
      break;
    case 'CLEAR':
      next = [];
      break;
    default:
      return state;
  }
  save(next);
  return next;
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], load);

  const addItem    = (item)       => dispatch({ type:'ADD', item });
  const removeItem = (id)         => dispatch({ type:'REMOVE', id });
  const setQty     = (id, qty)    => dispatch({ type:'QTY', id, qty });
  const clearCart  = ()           => dispatch({ type:'CLEAR' });

  const totalItems = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, setQty, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
};
