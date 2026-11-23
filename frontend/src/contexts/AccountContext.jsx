import { createContext, useContext, useMemo, useState } from 'react';
import { demoCustomer } from '../data/demoOrders.js';
import { addAddress, chooseDefaultAddress, removeAddress, updateAddress } from '../lib/accountState.js';

const AccountContext = createContext(null);

function createAddressId() {
  return globalThis.crypto?.randomUUID?.() || `address-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function AccountProvider({ children }) {
  const [profile, setProfile] = useState(() => ({ ...demoCustomer }));
  const [addresses, setAddresses] = useState([]);
  const value = useMemo(() => ({
    profile,
    addresses,
    saveProfile: (changes) => setProfile((current) => ({ ...current, ...changes })),
    addSavedAddress: (address) => setAddresses((current) => addAddress(current, address, createAddressId())),
    editSavedAddress: (id, changes) => setAddresses((current) => updateAddress(current, id, changes)),
    deleteSavedAddress: (id) => setAddresses((current) => removeAddress(current, id)),
    setDefaultAddress: (id) => setAddresses((current) => chooseDefaultAddress(current, id)),
  }), [profile, addresses]);
  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (!context) throw new Error('useAccount must be used within AccountProvider');
  return context;
}
