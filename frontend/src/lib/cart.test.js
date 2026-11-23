import test from 'node:test';
import assert from 'node:assert/strict';
import { addCartEntry, getCartSummary, restoreCartEntries, setCartQuantity } from './cart.js';
import { featuredDevices, productDetails } from '../data/homeContent.js';

const switchEntry = { productId: 'touch-switch', variantId: 'touch-switch-3g', offerId: 'switch-offer-a', quantity: 1 };

test('repeated same-offer additions merge while different offers remain separate', () => {
  const added = addCartEntry([switchEntry], switchEntry, productDetails);
  const separateOffer = addCartEntry(added, { ...switchEntry, offerId: 'switch-offer-b' }, productDetails);
  assert.deepEqual(separateOffer.map(({ offerId, quantity }) => ({ offerId, quantity })), [{ offerId: 'switch-offer-a', quantity: 2 }, { offerId: 'switch-offer-b', quantity: 1 }]);
});

test('quantity changes accept valid bounds and ignore invalid values', () => {
  assert.equal(setCartQuantity([switchEntry], switchEntry.offerId, switchEntry.variantId, 4)[0].quantity, 4);
  assert.equal(setCartQuantity([switchEntry], switchEntry.offerId, switchEntry.variantId, 0)[0].quantity, 1);
});

test('restore drops stale and corrupt entries and strips stored price fields', () => {
  assert.deepEqual(restoreCartEntries(JSON.stringify([{ ...switchEntry, price: 1 }, { ...switchEntry, offerId: 'removed-offer' }, { ...switchEntry, quantity: 0 }]), productDetails), [switchEntry]);
  assert.deepEqual(restoreCartEntries('{broken json', productDetails), []);
});

test('seller groups and integer-minor-unit totals use fixture prices', () => {
  const summary = getCartSummary([
    { ...switchEntry, quantity: 2 },
    { ...switchEntry, offerId: 'switch-offer-b', quantity: 1 },
    { productId: 'wifi-plug', variantId: 'wifi-plug-eu', offerId: 'plug-offer-eu', quantity: 3 },
  ], productDetails, featuredDevices);
  assert.equal(summary.sellerGroups.length, 2);
  assert.equal(summary.sellerGroups.find(({ seller }) => seller === 'Nile Smart Store').subtotalMinor, 492700);
  assert.equal(summary.itemsSubtotalMinor, 646700);
});
