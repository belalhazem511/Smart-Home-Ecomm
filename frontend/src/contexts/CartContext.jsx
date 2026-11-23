import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { addCartEntry, restoreCartEntries, setCartQuantity, validateCartEntry } from '../lib/cart.js';
import { productDetails } from '../data/homeContent.js';
import { demoSampleCart } from '../data/marketplaceDemo.js';

const CartContext = createContext(null);
const storageKey = 'smart-home-cart-v1';

function loadSavedCart() {
  try {
    const serialized = localStorage.getItem(storageKey);
    if (!serialized) return { entries: [], hadInvalidEntries: false };
    const parsed = JSON.parse(serialized);
    const sourceEntries = Array.isArray(parsed) ? parsed : [];
    return { entries: restoreCartEntries(serialized, productDetails), hadInvalidEntries: !Array.isArray(parsed) || sourceEntries.some((entry) => !validateCartEntry(entry, productDetails)) };
  } catch { return { entries: [], hadInvalidEntries: true }; }
}

export function CartProvider({ children }) {
  const [initialCart] = useState(loadSavedCart);
  const [entries, setEntries] = useState(initialCart.entries);
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(entries)); } catch { /* Cart remains available for this session. */ }
  }, [entries]);
  const value = useMemo(() => ({
    entries,
    hadInvalidEntries: initialCart.hadInvalidEntries,
    totalUnits: entries.reduce((sum, entry) => sum + entry.quantity, 0),
    addItem: (entry) => setEntries((current) => addCartEntry(current, entry, productDetails)),
    loadSampleCart: () => setEntries((current) => current.length ? current : demoSampleCart.reduce((next, entry) => addCartEntry(next, entry, productDetails), [])),
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
