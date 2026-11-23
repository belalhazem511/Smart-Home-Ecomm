import { demoCustomer, demoOrders } from './demoOrders.js';
import { demoMerchants, demoSellerMemberships } from './demoSeller.js';

export const demoMerchantApplications = [
  { id: 'application-northstar', businessName: 'Northstar Smart Living', city: 'Alexandria', submittedAt: '2026-11-20', status: 'Awaiting review' },
  { id: 'application-roomwise', businessName: 'Roomwise Devices', city: 'Cairo', submittedAt: '2026-11-18', status: 'Information requested' },
];

export const demoCatalogProposals = [
  { id: 'catalog-proposal-301', productName: 'Smart relay controller', category: 'Switches', submittedBy: 'Northstar Smart Living', submittedAt: '2026-11-21', status: 'Awaiting review' },
  { id: 'catalog-proposal-287', productName: 'Ambient light sensor', category: 'Sensors', submittedBy: 'Roomwise Devices', submittedAt: '2026-11-17', status: 'Information requested' },
];

export const demoOfferReviews = [
  { id: 'offer-review-401', merchantId: 'merchant-nile', productName: 'Zigbee Touch Switch', variant: '3 gang', sellerSku: 'NSS-SW-3G-REVIEW', priceMinor: 149000, submittedAt: '2026-11-21', status: 'Awaiting review' },
  { id: 'offer-review-392', merchantId: 'merchant-cairo', productName: 'Motion Sensor', variant: 'Standard', sellerSku: 'CC-SENSOR-REVIEW', priceMinor: 94000, submittedAt: '2026-11-16', status: 'Information requested' },
];

export const demoAdminUsers = [
  { id: 'demo-customer-user', name: demoCustomer.name, email: demoCustomer.email, accountType: 'Customer preview', memberships: [] },
  { id: 'demo-seller-user', name: 'Demo seller member', email: 'Not supplied in fixture', accountType: 'Seller preview', memberships: demoSellerMemberships.map((membership) => demoMerchants.find((merchant) => merchant.id === membership.merchantId)?.name).filter(Boolean) },
];

export { demoCustomer, demoOrders, demoMerchants };
