import { createContext, useContext, useMemo, useState } from 'react';
import { demoSellerDraftOffers, demoSellerOffers } from '../data/marketplaceDemo.js';
import { productDetails } from '../data/smartAtlasCatalog.js';
import { createOfferDraft, updateOfferDraft } from '../lib/sellerOffers.js';

const SellerOffersContext = createContext(null);

function createDraftId() {
  return globalThis.crypto?.randomUUID?.() || `draft-offer-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function SellerOffersProvider({ children }) {
  const [draftOffers, setDraftOffers] = useState(() => demoSellerDraftOffers.map((offer) => ({ ...offer })));
  const value = useMemo(() => ({
    draftOffers,
    addDraft: (draft, merchantId) => {
      const allOffers = [...demoSellerOffers, ...draftOffers];
      const created = createOfferDraft(draft, merchantId, allOffers, productDetails, createDraftId());
      if (!created) return false;
      setDraftOffers((current) => [...current, created]);
      return true;
    },
    editDraft: (offerId, merchantId, changes) => setDraftOffers((current) => updateOfferDraft(current, offerId, merchantId, changes, productDetails)),
  }), [draftOffers]);
  return <SellerOffersContext.Provider value={value}>{children}</SellerOffersContext.Provider>;
}

export function useSellerOffers() {
  const context = useContext(SellerOffersContext);
  if (!context) throw new Error('useSellerOffers must be used within SellerOffersProvider');
  return context;
}
