import test from 'node:test';
import assert from 'node:assert/strict';
import { demoOrders } from '../data/demoOrders.js';
import { findOrderById, getOrderCounts, getOrderSnapshotTotals, groupSnapshotItemsBySeller } from './orders.js';

test('order lookup returns a match and handles empty or unknown IDs', () => {
  assert.equal(findOrderById(demoOrders, 'demo-order-1042')?.number, 'SH-2026-1042');
  assert.equal(findOrderById([], 'demo-order-1042'), null);
  assert.equal(findOrderById(demoOrders, 'missing-order'), null);
});

test('historical items group by seller and retain seller delivery snapshots', () => {
  const groups = groupSnapshotItemsBySeller(demoOrders[0]);
  assert.equal(groups.length, 2);
  assert.equal(groups.find(({ sellerId }) => sellerId === 'seller-nile').delivery.chargeMinorSnapshot, 3500);
});

test('order totals sum purchase-time line and delivery snapshots only', () => {
  const order = structuredClone(demoOrders[0]);
  const totals = getOrderSnapshotTotals(order);
  assert.deepEqual(totals, { itemsSubtotalMinor: 398000, deliverySubtotalMinor: 7700, totalMinor: 405700 });
  order.items[0].unitPriceMinorSnapshot = 999999;
  assert.equal(getOrderSnapshotTotals(order).totalMinor, 405700);
});

test('empty history produces zero overview counts', () => {
  assert.deepEqual(getOrderCounts([]), { total: 0, processing: 0, completed: 0 });
});
