export function findDemoMerchant(merchantId, merchants, memberships) {
  const membership = memberships.find((item) => item.merchantId === merchantId);
  if (!membership) return null;
  const merchant = merchants.find((item) => item.id === membership.merchantId);
  return merchant ? { merchant, membership } : null;
}

export function getMerchantMemberships(merchants, memberships) {
  return memberships.flatMap((membership) => {
    const merchant = merchants.find((item) => item.id === membership.merchantId);
    return merchant ? [{ ...merchant, membershipLabel: membership.label }] : [];
  });
}

export function getSellerOverview(merchantId, merchants, memberships, sellerOrders) {
  const access = findDemoMerchant(merchantId, merchants, memberships);
  if (!access) return null;
  const orders = sellerOrders.filter((order) => order.merchantId === access.merchant.id);
  return {
    ...access,
    orders,
    counts: {
      total: orders.length,
      pendingPayment: orders.filter((order) => order.paymentStatus.startsWith('Pending payment')).length,
      readyForProcessing: orders.filter((order) => order.processingStatus === 'Ready for processing' && order.paymentStatus.startsWith('Paid')).length,
      inFulfillment: orders.filter((order) => order.processingStatus === 'Handed to carrier').length,
    },
  };
}
