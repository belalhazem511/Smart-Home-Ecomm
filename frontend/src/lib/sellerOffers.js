function getValidProductVariant(products, productId, variantId) {
  const product = products.find((item) => item.productId === productId);
  const variant = product?.variants.find((item) => item.id === variantId);
  return product && variant ? { product, variant } : null;
}

export function parsePriceToMinorUnits(value) {
  const input = String(value ?? '').trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(input)) return null;
  const [whole, fraction = ''] = input.split('.');
  const minorUnits = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  return Number.isSafeInteger(minorUnits) && minorUnits > 0 ? minorUnits : null;
}

export function validateOfferDraft(draft, merchantId, offers, products, editingOfferId = '') {
  const errors = {};
  if (!getValidProductVariant(products, draft.productId, draft.variantId)) {
    errors.variantId = 'Choose an approved product and one of its variants.';
  }
  if (!String(draft.sellerSku || '').trim()) errors.sellerSku = 'Enter a seller SKU.';
  else if (offers.some((offer) => offer.merchantId === merchantId
    && offer.id !== editingOfferId
    && offer.sellerSku.trim().toLowerCase() === draft.sellerSku.trim().toLowerCase())) {
    errors.sellerSku = 'This SKU is already used by this merchant.';
  }
  if (parsePriceToMinorUnits(draft.price) === null) errors.price = 'Enter a positive price with up to two decimal places.';
  return errors;
}

export function getOffersForMerchant(merchantId, merchants, memberships, publishedOffers, draftOffers) {
  if (!memberships.some((membership) => membership.merchantId === merchantId)
    || !merchants.some((merchant) => merchant.id === merchantId)) return null;
  return [...publishedOffers, ...draftOffers].filter((offer) => offer.merchantId === merchantId);
}

export function findEditableDraft(offerId, merchantId, draftOffers) {
  return draftOffers.find((offer) => offer.id === offerId && offer.merchantId === merchantId && offer.status === 'Draft') || null;
}

export function createOfferDraft(draft, merchantId, offers, products, id) {
  if (Object.keys(validateOfferDraft(draft, merchantId, offers, products)).length) return null;
  const selected = getValidProductVariant(products, draft.productId, draft.variantId);
  return {
    id, merchantId, productId: selected.product.productId, variantId: selected.variant.id,
    sellerSku: draft.sellerSku.trim(), priceMinor: parsePriceToMinorUnits(draft.price),
    warranty: draft.warranty.trim(), status: 'Draft',
  };
}

export function updateOfferDraft(offers, offerId, merchantId, changes, products) {
  const current = findEditableDraft(offerId, merchantId, offers);
  if (!current) return null;
  const formValues = { ...changes, price: String(changes.price ?? '') };
  const errors = validateOfferDraft(formValues, merchantId, offers, products, offerId);
  if (Object.keys(errors).length) return null;
  const selected = getValidProductVariant(products, formValues.productId, formValues.variantId);
  const updated = {
    ...current, productId: selected.product.productId, variantId: selected.variant.id,
    sellerSku: formValues.sellerSku.trim(), priceMinor: parsePriceToMinorUnits(formValues.price),
    warranty: formValues.warranty.trim(), status: 'Draft',
  };
  return offers.map((offer) => offer.id === offerId && offer.merchantId === merchantId ? updated : offer);
}

export function formatMinorUnitsForInput(value) {
  return (value / 100).toFixed(2);
}
