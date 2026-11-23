import test from 'node:test';
import assert from 'node:assert/strict';
import { changeVariant, findAvailableOffer, selectOffer } from './productSelection.js';
import { productDetails } from '../data/homeContent.js';

const product = productDetails[0];

test('variant change clears a seller offer belonging to another variant', () => {
  const selected = { variantId: 'touch-switch-3g', offerId: 'switch-offer-a' };
  assert.deepEqual(changeVariant(selected, 'touch-switch-2g', product.offers), { variantId: 'touch-switch-2g', offerId: '' });
});

test('variant change keeps an offer only when it remains valid', () => {
  const selected = { variantId: 'touch-switch-3g', offerId: 'switch-offer-2g' };
  assert.equal(changeVariant(selected, 'touch-switch-2g', product.offers).offerId, 'switch-offer-2g');
});

test('invalid, mismatched, and unavailable offer selections are rejected', () => {
  assert.equal(findAvailableOffer(product.offers, 'touch-switch-2g', 'switch-offer-unavailable'), null);
  const prior = { variantId: 'touch-switch-3g', offerId: 'switch-offer-a' };
  assert.deepEqual(selectOffer(prior, 'touch-switch-2g', 'switch-offer-a', product.offers), prior);
});
