import { categories, deliveryOptionsBySeller, featuredDevices, productDetails } from './marketplaceDemo.js';

export { categories, deliveryOptionsBySeller, featuredDevices, productDetails };

export const formatPrice = (amount) => `EGP ${Number(amount).toLocaleString('en-EG', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
export const formatMinorUnits = (amount) => `EGP ${(amount / 100).toLocaleString('en-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
