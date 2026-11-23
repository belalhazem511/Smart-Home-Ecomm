export const demoMerchants = [
  { id: 'merchant-nile', name: 'Nile Smart Store', region: 'Cairo' },
  { id: 'merchant-cairo', name: 'Cairo Connected', region: 'Giza' },
];

export const demoSellerMemberships = [
  { userId: 'demo-seller-user', merchantId: 'merchant-nile', label: 'Demo seller member' },
  { userId: 'demo-seller-user', merchantId: 'merchant-cairo', label: 'Demo seller member' },
];

export const demoSellerOrders = [
  { id: 'seller-nile-1042', merchantId: 'merchant-nile', sellerOrderNumber: 'NS-1042', createdAt: '2026-11-20', itemCount: 2, itemsTotalMinor: 157500, orderStatus: 'Confirmed (demo)', paymentStatus: 'Pending payment (demo)', processingStatus: 'Waiting for payment' },
  { id: 'seller-nile-1039', merchantId: 'merchant-nile', sellerOrderNumber: 'NS-1039', createdAt: '2026-11-19', itemCount: 1, itemsTotalMinor: 89000, orderStatus: 'Confirmed (demo)', paymentStatus: 'Paid (demo)', processingStatus: 'Ready for processing' },
  { id: 'seller-nile-1028', merchantId: 'merchant-nile', sellerOrderNumber: 'NS-1028', createdAt: '2026-11-16', itemCount: 3, itemsTotalMinor: 252000, orderStatus: 'Fulfillment (demo)', paymentStatus: 'Paid (demo)', processingStatus: 'Handed to carrier' },
  { id: 'seller-cairo-2081', merchantId: 'merchant-cairo', sellerOrderNumber: 'CC-2081', createdAt: '2026-11-21', itemCount: 1, itemsTotalMinor: 249000, orderStatus: 'Confirmed (demo)', paymentStatus: 'Pending payment (demo)', processingStatus: 'Waiting for payment' },
  { id: 'seller-cairo-2074', merchantId: 'merchant-cairo', sellerOrderNumber: 'CC-2074', createdAt: '2026-11-18', itemCount: 2, itemsTotalMinor: 144000, orderStatus: 'Confirmed (demo)', paymentStatus: 'Paid (demo)', processingStatus: 'Ready for processing' },
];
