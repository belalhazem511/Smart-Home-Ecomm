import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { addCartEntry, restoreCartEntries, setCartQuantity } from '../lib/cart.js';
import { productDetails } from '../data/homeContent.js';

const CartContext = createContext(null);
const storageKey = 'smart-home-cart-v1';

function loadSavedCart() {
  try { return restoreCartEntries(localStorage.getItem(storageKey), productDetails); }
  catch { return []; }
}

export function CartProvider({ children }) {
  const [entries, setEntries] = useState(loadSavedCart);
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(entries)); } catch { /* Cart remains available for this session. */ }
  }, [entries]);
  const value = useMemo(() => ({
    entries,
    totalUnits: entries.reduce((sum, entry) => sum + entry.quantity, 0),
    addItem: (entry) => setEntries((current) => addCartEntry(current, entry, productDetails)),
    changeQuantity: (offerId, variantId, quantity) => setEntries((current) => setCartQuantity(current, offerId, variantId, quantity)),
    removeItem: (offerId, variantId) => setEntries((current) => current.filter((entry) => entry.offerId !== offerId || entry.variantId !== variantId)),
  }), [entries]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
