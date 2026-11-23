import test from 'node:test';
import assert from 'node:assert/strict';
import { demoMerchants, demoSellerMemberships, demoSellerOffers } from '../data/demoSeller.js';
import { demoSellerDraftOffers } from '../data/marketplaceDemo.js';
import { productDetails } from '../data/homeContent.js';
import { createOfferDraft, findEditableDraft, getOffersForMerchant, parsePriceToMinorUnits, updateOfferDraft, validateOfferDraft } from './sellerOffers.js';

const validDraft = { productId: 'touch-switch', variantId: 'touch-switch-3g', sellerSku: 'NSS-DRAFT-01', price: '123.45', warranty: 'Warranty terms provided by seller.' };

test('offer lists and draft IDs stay isolated to assigned merchants', () => {
  const nile = getOffersForMerchant('merchant-nile', demoMerchants, demoSellerMemberships, demoSellerOffers, []);
  assert.ok(nile.every((offer) => offer.merchantId === 'merchant-nile'));
  assert.equal(getOffersForMerchant('unassigned', demoMerchants, demoSellerMemberships, demoSellerOffers, []), null);
  assert.equal(findEditableDraft('switch-offer-b', 'merchant-nile', demoSellerOffers), null);
});

test('draft validation requires an approved product and compatible variant', () => {
  const invalid = validateOfferDraft({ ...validDraft, variantId: 'wifi-plug-eu' }, 'merchant-nile', demoSellerOffers, productDetails);
  assert.match(invalid.variantId, /approved product/);
});

test('seller SKU uniqueness is merchant-scoped and excludes the edited draft', () => {
  assert.ok(validateOfferDraft({ ...validDraft, sellerSku: 'nss-01-3-gang' }, 'merchant-nile', demoSellerOffers, productDetails).sellerSku);
  assert.equal(validateOfferDraft({ ...validDraft, sellerSku: 'NSS-SW-3G' }, 'merchant-cairo', demoSellerOffers, productDetails).sellerSku, undefined);
});

test('price parsing accepts positive minor-unit precision and rejects invalid amounts', () => {
  assert.equal(parsePriceToMinorUnits('123.45'), 12345);
  assert.equal(parsePriceToMinorUnits('10'), 1000);
  for (const value of ['0', '-1', '1.999', 'abc', '1e3']) assert.equal(parsePriceToMinorUnits(value), null);
});

test('creation and editing always produce drafts and reject published or cross-merchant IDs', () => {
  const created = createOfferDraft(validDraft, 'merchant-nile', demoSellerOffers, productDetails, 'draft-local-1');
  assert.equal(created.status, 'Draft');
  const drafts = [...demoSellerOffers, created];
  assert.equal(updateOfferDraft(drafts, 'switch-offer-a', 'merchant-nile', validDraft, productDetails), null);
  assert.equal(updateOfferDraft(drafts, 'draft-local-1', 'merchant-cairo', validDraft, productDetails), null);
  const updated = updateOfferDraft(drafts, 'draft-local-1', 'merchant-nile', { ...validDraft, price: '150.25' }, productDetails);
  assert.equal(updated.find((offer) => offer.id === 'draft-local-1').status, 'Draft');
  assert.equal(updated.find((offer) => offer.id === 'draft-local-1').priceMinor, 15025);
});

test('canonical draft fixture is editable only for its assigned merchant', () => {
  const [fixtureDraft] = demoSellerDraftOffers;
  assert.equal(fixtureDraft.status, 'Draft');
  assert.ok(findEditableDraft(fixtureDraft.id, fixtureDraft.merchantId, demoSellerDraftOffers));
  assert.equal(findEditableDraft(fixtureDraft.id, 'merchant-cairo', demoSellerDraftOffers), null);
});
