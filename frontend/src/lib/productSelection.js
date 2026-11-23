export function findAvailableOffer(offers, variantId, offerId) {
  return offers.find((offer) => offer.id === offerId && offer.variantId === variantId && offer.available) || null;
}

export function changeVariant(selection, nextVariantId, offers) {
  const offer = findAvailableOffer(offers, nextVariantId, selection.offerId);
  return { variantId: nextVariantId, offerId: offer?.id || '' };
}

export function selectOffer(selection, variantId, offerId, offers) {
  const offer = findAvailableOffer(offers, variantId, offerId);
  return offer ? { variantId, offerId: offer.id } : selection;
}
