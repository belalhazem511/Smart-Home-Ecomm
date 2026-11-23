import test from 'node:test';
import assert from 'node:assert/strict';
import { demoOrders } from '../data/demoOrders.js';
import { findOrderById, getOrderCounts, getOrderSnapshotTotals, groupSnapshotItemsBySeller } from './orders.js';

test('order lookup returns a match and handles empty or unknown IDs', () => {
  assert.equal(findOrderById(demoOrders, 'SH-2026-1042')?.number, 'SH-2026-1042');
  assert.equal(findOrderById([], 'SH-2026-1042'), null);
  assert.equal(findOrderById(demoOrders, 'missing-order'), null);
});

test('historical items group by seller and retain seller delivery snapshots', () => {
  const groups = groupSnapshotItemsBySeller(demoOrders[0]);
  assert.equal(groups.length, 2);
  assert.equal(groups.find(({ sellerId }) => sellerId === 'merchant-nile').delivery.chargeMinorSnapshot, 5500);
});

test('order totals preserve purchase-time discounts and total snapshots', () => {
  const order = structuredClone(demoOrders[0]);
  const totals = getOrderSnapshotTotals(order);
  assert.deepEqual(totals, { itemsSubtotalMinor: 327900, discountMinor: 1500, deliverySubtotalMinor: 12000, totalMinor: 338400 });
  order.items[0].unitPriceMinorSnapshot = 999999;
  assert.equal(getOrderSnapshotTotals(order).totalMinor, 338400);
});

test('empty history produces zero overview counts', () => {
  assert.deepEqual(getOrderCounts([]), { total: 0, processing: 0, completed: 0 });
});
