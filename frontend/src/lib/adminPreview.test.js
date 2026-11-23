import test from 'node:test';
import assert from 'node:assert/strict';
import { getAdminOverviewCounts, findAdminRecord } from './adminPreview.js';

const fixtureSets = {
  merchantApplications: [{ status: 'Awaiting review' }, { status: 'Information requested' }],
  users: [{ id: 'user-1' }],
  catalogProposals: [{ status: 'Awaiting review' }],
  offerReviews: [{ status: 'Published' }, { status: 'Awaiting review' }],
  orders: [{ id: 'order-1' }, { id: 'order-2' }],
};

test('admin preview counts are derived from the supplied fictional queues', () => {
  assert.deepEqual(getAdminOverviewCounts(fixtureSets), {
    merchantApplications: 2,
    merchantApplicationsAwaitingReview: 1,
    users: 1,
    catalogProposalsAwaitingReview: 1,
    offersAwaitingReview: 1,
    orders: 2,
  });
});

test('admin record lookup returns the selected fixture or a clear missing result', () => {
  assert.equal(findAdminRecord(fixtureSets.orders, 'order-1').id, 'order-1');
  assert.equal(findAdminRecord(fixtureSets.orders, 'unknown-order'), null);
});
