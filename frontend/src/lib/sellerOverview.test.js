import test from 'node:test';
import assert from 'node:assert/strict';
import { demoMerchants, demoSellerMemberships, demoSellerOrders } from '../data/demoSeller.js';
import { findDemoMerchant, getMerchantMemberships, getSellerOverview } from './sellerOverview.js';

test('merchant lookup returns only an explicitly assigned merchant', () => {
  assert.equal(findDemoMerchant('merchant-nile', demoMerchants, demoSellerMemberships).merchant.name, 'Nile Smart Store');
  assert.equal(findDemoMerchant('merchant-unknown', demoMerchants, demoSellerMemberships), null);
  assert.equal(findDemoMerchant('merchant-nile', demoMerchants, demoSellerMemberships.filter((item) => item.merchantId !== 'merchant-nile')), null);
});

test('merchant selector contains only explicit demo memberships', () => {
  assert.deepEqual(getMerchantMemberships(demoMerchants, demoSellerMemberships).map(({ id }) => id), ['merchant-nile', 'merchant-cairo', 'merchant-delta', 'merchant-living']);
  assert.deepEqual(getMerchantMemberships(demoMerchants, [demoSellerMemberships[1]]).map(({ id }) => id), ['merchant-cairo']);
});

test('overview counts and orders are scoped to the selected merchant', () => {
  const nile = getSellerOverview('merchant-nile', demoMerchants, demoSellerMemberships, demoSellerOrders);
  const cairo = getSellerOverview('merchant-cairo', demoMerchants, demoSellerMemberships, demoSellerOrders);
  assert.deepEqual(nile.counts, { total: 12, pendingPayment: 1, readyForProcessing: 2, inFulfillment: 2 });
  assert.deepEqual(cairo.counts, { total: 14, pendingPayment: 1, readyForProcessing: 3, inFulfillment: 2 });
  assert.equal(getSellerOverview('merchant-delta', demoMerchants, demoSellerMemberships, demoSellerOrders).counts.total, 15);
  assert.equal(getSellerOverview('merchant-living', demoMerchants, demoSellerMemberships, demoSellerOrders).counts.total, 13);
  assert.ok(nile.orders.every((order) => order.merchantId === 'merchant-nile'));
  assert.ok(cairo.orders.every((order) => order.merchantId === 'merchant-cairo'));
});

test('unknown and unassigned merchant IDs produce no overview data', () => {
  assert.equal(getSellerOverview('merchant-missing', demoMerchants, demoSellerMemberships, demoSellerOrders), null);
  assert.equal(getSellerOverview('merchant-nile', demoMerchants, [], demoSellerOrders), null);
});
