import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { featuredDevices, productDetails } from '../data/homeContent.js';
import { allDemoOrders, categoryRecords, customerDemoOrders, demoAdminUsers, demoCatalogProposals, demoCustomerAddresses, demoData, demoMerchantApplications, demoOfferReviews, demoSampleCart, demoSellerDraftOffers, demoSellerOffers, demoSellerOrders, demoMerchants, demoSellerMemberships } from '../data/marketplaceDemo.js';
import { getCartSummary, validateCartEntry } from './cart.js';
import { getOrderSnapshotTotals } from './orders.js';
import { getSellerOverview } from './sellerOverview.js';

test('the canonical fixture fills implemented public product surfaces with eligible offers', () => {
  assert.equal(categoryRecords.length, 6);
  assert.equal(featuredDevices.length, 12);
  assert.equal(productDetails.length, 12);
  for (const detail of productDetails) {
    assert.ok(featuredDevices.some((product) => product.id === detail.productId));
    assert.ok(detail.offers.every((offer) => offer.status === 'published'));
    assert.ok(detail.offers.every((offer) => !offer.available || offer.stockQuantity > 0));
  }
  const ukPlug = productDetails.find((product) => product.slug === 'smart-wi-fi-plug').variants.find((variant) => variant.id === 'wifi-plug-uk');
  assert.equal(ukPlug.image, null);
  assert.match(ukPlug.imageNote, /EU version shown/);
  assert.equal(productDetails.find((product) => product.slug === 'smart-wi-fi-plug').offers.some((offer) => offer.variantId === ukPlug.id), false);
  const zeroStockOffer = productDetails.find((product) => product.slug === 'smart-bulb').offers.find((offer) => offer.stockQuantity === 0);
  assert.equal(zeroStockOffer.available, false);
});

test('sample cart is explicit, identifier-only, stock-valid and totals in integer minor units', () => {
  assert.equal(demoSampleCart.length, 3);
  assert.ok(demoSampleCart.every((entry) => validateCartEntry(entry, productDetails)));
  assert.ok(demoSampleCart.every((entry) => Object.keys(entry).sort().join(',') === 'offerId,productId,quantity,variantId'));
  const summary = getCartSummary(demoSampleCart, productDetails, featuredDevices);
  assert.equal(summary.itemsSubtotalMinor, 377800);
  assert.equal(summary.sellerGroups.length, 2);
});

test('customer and admin receive correctly scoped parent order snapshots and reconciled seller splits', () => {
  assert.equal(customerDemoOrders.length, 8);
  assert.ok(customerDemoOrders.every((order) => order.customerId === demoData.meta.defaultCustomerId));
  assert.equal(allDemoOrders.length, 24);
  for (const order of allDemoOrders) {
    assert.equal(getOrderSnapshotTotals(order).totalMinor, order.totalMinorSnapshot);
    const splits = order.id && demoData.sellerOrders.filter((item) => order.id === item.orderId);
    assert.equal(splits.reduce((total, split) => total + split.totalMinor, 0), order.totalMinorSnapshot);
  }
  assert.equal(getOrderSnapshotTotals(customerDemoOrders[0]).discountMinor, 1500);
});

test('all four seller previews are membership-scoped to their fixture order splits', () => {
  assert.deepEqual(demoSellerMemberships.map((membership) => membership.merchantId), ['merchant-nile', 'merchant-cairo', 'merchant-delta', 'merchant-living']);
  assert.deepEqual(demoMerchants.map((merchant) => getSellerOverview(merchant.id, demoMerchants, demoSellerMemberships, demoSellerOrders).counts.total), [12, 14, 15, 13]);
  assert.equal(demoSellerOrders.length, 54);
  assert.ok(demoSellerOffers.some((offer) => offer.status === 'Changes requested'));
  assert.ok(demoSellerOffers.some((offer) => offer.status === 'Pending review'));
  assert.ok(demoSellerOffers.some((offer) => offer.status === 'Suspended'));
  assert.equal(demoSellerDraftOffers.length, 1);
  assert.equal(getSellerOverview('unassigned-merchant', demoMerchants, demoSellerMemberships, demoSellerOrders), null);
});

test('account, admin queue fixtures and all mapped local images are present', () => {
  assert.equal(demoCustomerAddresses.length, 2);
  assert.equal(demoCustomerAddresses.filter((address) => address.isDefault).length, 1);
  assert.equal(demoAdminUsers.length, 20);
  assert.equal(demoMerchantApplications.length, 4);
  assert.equal(demoCatalogProposals.length, 4);
  assert.equal(demoOfferReviews.length, 4);
  const imagePaths = [demoData.campaign.image, ...demoData.products.map((product) => product.image), ...demoData.merchants.map((merchant) => merchant.logo)];
  for (const imagePath of imagePaths) assert.ok(existsSync(resolve(process.cwd(), 'public', `.${imagePath}`)), `${imagePath} should exist under frontend/public`);
});
