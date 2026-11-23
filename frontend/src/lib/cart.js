export const MAX_CART_QUANTITY = 99;

export function validateCartEntry(entry, productDetails) {
  if (!entry || typeof entry !== 'object' || typeof entry.productId !== 'string' || typeof entry.variantId !== 'string' || typeof entry.offerId !== 'string') return false;
  if (!Number.isInteger(entry.quantity) || entry.quantity < 1 || entry.quantity > MAX_CART_QUANTITY) return false;
  return productDetails.some((product) => product.productId === entry.productId && product.variants.some((variant) => variant.id === entry.variantId) && product.offers.some((offer) => offer.id === entry.offerId && offer.variantId === entry.variantId && offer.available && (!Number.isInteger(offer.stockQuantity) || offer.stockQuantity >= entry.quantity)));
}

export function restoreCartEntries(serialized, productDetails) {
  try {
    const entries = JSON.parse(serialized);
    if (!Array.isArray(entries)) return [];
    return entries.filter((entry) => validateCartEntry(entry, productDetails)).reduce((restored, entry) => addCartEntry(restored, entry, productDetails), []);
  } catch { return []; }
}

export function addCartEntry(entries, nextEntry, productDetails) {
  if (!validateCartEntry(nextEntry, productDetails)) return entries;
  const key = (entry) => `${entry.productId}:${entry.variantId}:${entry.offerId}`;
  const existing = entries.find((entry) => key(entry) === key(nextEntry));
  if (!existing) return [...entries, { productId: nextEntry.productId, variantId: nextEntry.variantId, offerId: nextEntry.offerId, quantity: nextEntry.quantity }];
  const offer = productDetails.find((product) => product.productId === nextEntry.productId)?.offers.find((item) => item.id === nextEntry.offerId);
  const quantityLimit = Number.isInteger(offer?.stockQuantity) ? Math.min(MAX_CART_QUANTITY, offer.stockQuantity) : MAX_CART_QUANTITY;
  return entries.map((entry) => key(entry) === key(nextEntry) ? { ...entry, quantity: Math.min(quantityLimit, entry.quantity + nextEntry.quantity) } : entry);
}

export function setCartQuantity(entries, offerId, variantId, quantity) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_CART_QUANTITY) return entries;
  return entries.map((entry) => entry.offerId === offerId && entry.variantId === variantId ? { ...entry, quantity } : entry);
}

export function getCartSummary(entries, productDetails, products) {
  const groups = new Map();
  for (const entry of entries) {
    if (!validateCartEntry(entry, productDetails)) continue;
    const detail = productDetails.find((item) => item.productId === entry.productId);
    const product = products.find((item) => item.id === entry.productId);
    const offer = detail.offers.find((item) => item.id === entry.offerId);
    const variant = detail.variants.find((item) => item.id === entry.variantId);
    if (!groups.has(offer.seller)) groups.set(offer.seller, { seller: offer.seller, items: [], subtotalMinor: 0 });
    const group = groups.get(offer.seller);
    const unitPriceMinor = Number.isInteger(offer.priceMinor) ? offer.priceMinor : Math.round(offer.price * 100);
    const line = { ...entry, productName: product.name, variantName: variant.label, offer, unitPriceMinor, lineTotalMinor: unitPriceMinor * entry.quantity };
    group.items.push(line);
    group.subtotalMinor += line.lineTotalMinor;
  }
  const sellerGroups = [...groups.values()];
  return { sellerGroups, itemsSubtotalMinor: sellerGroups.reduce((total, group) => total + group.subtotalMinor, 0) };
}
