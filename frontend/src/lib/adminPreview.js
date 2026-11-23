export function getAdminOverviewCounts({ merchantApplications, users, catalogProposals, offerReviews, orders }) {
  const inReview = (records) => records.filter((record) => record.status === 'Awaiting review').length;
  return {
    merchantApplications: merchantApplications.length,
    merchantApplicationsAwaitingReview: inReview(merchantApplications),
    users: users.length,
    catalogProposalsAwaitingReview: inReview(catalogProposals),
    offersAwaitingReview: inReview(offerReviews),
    orders: orders.length,
  };
}

export function findAdminRecord(records, recordId) {
  return records.find((record) => record.id === recordId) || null;
}
