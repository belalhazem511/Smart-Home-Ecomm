export const checkoutSteps = ['address', 'delivery', 'payment', 'review'];

export function validateAddress(address) {
  const required = ['fullName', 'phone', 'city', 'street'];
  return Object.fromEntries(required.map((field) => [field, String(address[field] || '').trim().length > 0]));
}

export function highestAllowedStep({ address, deliverySelections, sellerNames, paymentMethod }) {
  const addressValid = Object.values(validateAddress(address)).every(Boolean);
  if (!addressValid) return 0;
  const deliveryComplete = sellerNames.length > 0 && sellerNames.every((seller) => Boolean(deliverySelections[seller]));
  if (!deliveryComplete) return 1;
  if (!paymentMethod) return 2;
  return 3;
}

export function resolveCheckoutStep(requestedStep, prerequisites) {
  const requestedIndex = Math.max(0, checkoutSteps.indexOf(requestedStep));
  return checkoutSteps[Math.min(requestedIndex, highestAllowedStep(prerequisites))];
}

export function calculateDeliveryMinor(deliverySelections, sellerGroups, optionsBySeller) {
  return sellerGroups.reduce((total, group) => {
    const selectedOption = optionsBySeller[group.seller]?.find((option) => option.id === deliverySelections[group.seller]);
    return total + (selectedOption?.chargeMinor || 0);
  }, 0);
}

export function calculateCheckoutTotals(itemsSubtotalMinor, deliveryMinor) {
  return { itemsSubtotalMinor, deliveryMinor, estimatedTotalMinor: itemsSubtotalMinor + deliveryMinor };
}

export function hasValidCheckoutItems(cartEntries, sellerGroups, productDetails = []) {
  return cartEntries.length > 0 && sellerGroups.length > 0
    && cartEntries.every((entry) => productDetails.some((product) => product.productId === entry.productId
      && product.variants.some((variant) => variant.id === entry.variantId)
      && product.offers.some((offer) => offer.id === entry.offerId && offer.variantId === entry.variantId && offer.available)));
}
