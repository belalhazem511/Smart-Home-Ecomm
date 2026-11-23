import { validateAddress } from './checkout.js';

export function validateProfile(profile) {
  const errors = {};
  if (!String(profile.name || '').trim()) errors.name = 'Enter your name.';
  if (!String(profile.phone || '').trim()) errors.phone = 'Enter your phone number.';
  else if (!/^[+\d()\s-]{7,20}$/.test(profile.phone.trim()) || profile.phone.replace(/\D/g, '').length < 7 || profile.phone.replace(/\D/g, '').length > 15) errors.phone = 'Enter a phone number with 7–15 digits.';
  return errors;
}

export function validateSavedAddress(address) {
  const required = validateAddress(address);
  const messages = { fullName: 'Enter your full name.', phone: 'Enter a valid phone number.', city: 'Enter your city.', street: 'Enter your street address.' };
  return Object.fromEntries(Object.entries(required).filter(([, valid]) => !valid).map(([field]) => [field, messages[field]]));
}

export function addAddress(addresses, address, id) {
  return [...addresses, { ...address, id, isDefault: addresses.length === 0 }];
}

export function updateAddress(addresses, id, changes) {
  return addresses.map((address) => address.id === id ? { ...address, ...changes, id, isDefault: address.isDefault } : address);
}

export function removeAddress(addresses, id) {
  const remaining = addresses.filter((address) => address.id !== id);
  if (!remaining.length || !addresses.find((address) => address.id === id)?.isDefault) return remaining;
  return remaining.map((address, index) => ({ ...address, isDefault: index === 0 }));
}

export function chooseDefaultAddress(addresses, id) {
  if (!addresses.some((address) => address.id === id)) return addresses;
  return addresses.map((address) => ({ ...address, isDefault: address.id === id }));
}
