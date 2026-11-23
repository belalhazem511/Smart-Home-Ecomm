export const demoCustomer = {
  name: 'Jordan Lee',
  email: 'jordan.lee@example.test',
  phone: '01012345678',
  label: 'Fictional demo customer',
};

export const demoOrders = [
  {
    id: 'demo-order-1042', number: 'SH-2026-1042', placedAt: '2026-11-16',
    status: 'Processing (demo)', paymentStatus: 'Paid (demo)', deliveryStatus: 'Preparing (demo)',
    items: [
      { sellerId: 'seller-nile', sellerNameSnapshot: 'Nile Smart Store', productNameSnapshot: 'Zigbee Touch Switch', variantNameSnapshot: '3 gang', unitPriceMinorSnapshot: 149000, quantity: 1, lineTotalMinorSnapshot: 149000 },
      { sellerId: 'seller-cairo', sellerNameSnapshot: 'Cairo Connected', productNameSnapshot: 'Smart Home Hub', variantNameSnapshot: 'Multi-protocol', unitPriceMinorSnapshot: 249000, quantity: 1, lineTotalMinorSnapshot: 249000 },
    ],
    sellerDeliveries: [
      { sellerId: 'seller-nile', methodSnapshot: 'Standard delivery · 3–5 days', statusSnapshot: 'Preparing (demo)', chargeMinorSnapshot: 3500, trackingSnapshot: 'Not available in demo' },
      { sellerId: 'seller-cairo', methodSnapshot: 'Standard delivery · 3–5 days', statusSnapshot: 'Label not created (demo)', chargeMinorSnapshot: 4200, trackingSnapshot: 'Not available in demo' },
    ],
  },
  {
    id: 'demo-order-1031', number: 'SH-2026-1031', placedAt: '2026-10-28',
    status: 'Completed (demo)', paymentStatus: 'Paid (demo)', deliveryStatus: 'Delivered (demo)',
    items: [
      { sellerId: 'seller-nile', sellerNameSnapshot: 'Nile Smart Store', productNameSnapshot: 'Smart Wi-Fi Plug', variantNameSnapshot: 'EU plug', unitPriceMinorSnapshot: 64900, quantity: 2, lineTotalMinorSnapshot: 129800 },
    ],
    sellerDeliveries: [
      { sellerId: 'seller-nile', methodSnapshot: 'Standard delivery · 3–5 days', statusSnapshot: 'Delivered (demo)', chargeMinorSnapshot: 3500, trackingSnapshot: 'Not available in demo' },
    ],
  },
];
