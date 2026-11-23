import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCheckoutTotals, calculateDeliveryMinor, hasValidCheckoutItems, highestAllowedStep, resolveCheckoutStep, validateAddress } from './checkout.js';
import { productDetails } from '../data/homeContent.js';

const address = { fullName: 'Alex Smith', phone: '01000000000', city: 'Cairo', street: '12 Example Street' };
const groups = [{ seller: 'Seller A' }, { seller: 'Seller B' }];
const deliveryOptions = {
  'Seller A': [{ id: 'standard-a', chargeMinor: 3500 }],
  'Seller B': [{ id: 'standard-b', chargeMinor: 5200 }],
};

test('address validation requires all checkout fields', () => {
  assert.equal(Object.values(validateAddress(address)).every(Boolean), true);
  assert.equal(Object.values(validateAddress({ ...address, phone: ' ' })).every(Boolean), false);
});

test('step guards stop direct review requests at the highest completed prerequisite', () => {
  const incomplete = { address: {}, deliverySelections: {}, sellerNames: ['Seller A'], paymentMethod: '' };
  assert.equal(resolveCheckoutStep('review', incomplete), 'address');
  const addressDone = { ...incomplete, address };
  assert.equal(resolveCheckoutStep('review', addressDone), 'delivery');
  const deliveryDone = { ...addressDone, deliverySelections: { 'Seller A': 'standard-a' } };
  assert.equal(highestAllowedStep(deliveryDone), 2);
  assert.equal(resolveCheckoutStep('review', { ...deliveryDone, paymentMethod: 'cod' }), 'review');
});

test('seller delivery charges sum independently and totals use integer minor units', () => {
  const delivery = calculateDeliveryMinor({ 'Seller A': 'standard-a', 'Seller B': 'standard-b' }, groups, deliveryOptions);
  assert.equal(delivery, 8700);
  assert.deepEqual(calculateCheckoutTotals(123450, delivery), { itemsSubtotalMinor: 123450, deliveryMinor: 8700, estimatedTotalMinor: 132150 });
});

test('empty or invalid cart cannot enter checkout', () => {
  assert.equal(hasValidCheckoutItems([], groups, productDetails), false);
  assert.equal(hasValidCheckoutItems([{ productId: 'stale' }], [], productDetails), false);
  assert.equal(hasValidCheckoutItems([{ productId: 'touch-switch', variantId: 'touch-switch-3g', offerId: 'switch-offer-a', quantity: 1 }], groups, productDetails), true);
  assert.equal(hasValidCheckoutItems([{ productId: 'stale' }, { productId: 'touch-switch', variantId: 'touch-switch-3g', offerId: 'switch-offer-a', quantity: 1 }], groups, productDetails), false);
});
