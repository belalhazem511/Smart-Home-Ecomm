import { useState } from 'react';
import SellerPortalLayout from '../components/layout/SellerPortalLayout.jsx';
import { useSellerOffers } from '../contexts/SellerOffersContext.jsx';
import { demoMerchants, demoSellerMemberships, demoSellerOffers } from '../data/demoSeller.js';
import { featuredDevices, formatMinorUnits, productDetails } from '../data/homeContent.js';
import { findDemoMerchant, getMerchantMemberships } from '../lib/sellerOverview.js';
import { getOffersForMerchant } from '../lib/sellerOffers.js';

function getOfferLabels(offer) {
  const product = featuredDevices.find((item) => item.id === offer.productId);
  const detail = productDetails.find((item) => item.productId === offer.productId);
  const variant = detail?.variants.find((item) => item.id === offer.variantId);
  return { product: product?.name || 'Unknown product', variant: variant?.label || 'Unknown variant' };
}

function Unavailable() {
  return <main className="mx-auto max-w-content px-4 py-12"><h1 className="text-2xl font-bold">Offers unavailable</h1><p className="mt-2 text-slate-600">This merchant is unknown or not assigned to the demo seller.</p><a href="/seller" className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-brand px-5 text-white">Choose a demo store</a></main>;
}

function OfferCard({ offer, basePath }) {
  const labels = getOfferLabels(offer);
  return <article className="rounded-xl border border-slate-200 bg-white p-4">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-semibold">{labels.product}</h2><p className="mt-1 text-sm text-slate-600">Variant: {labels.variant}</p></div><span className={`rounded-full px-3 py-1 text-sm ${offer.status === 'Draft' ? 'bg-amber-50 text-amber-900' : 'bg-slate-100 text-slate-700'}`}>{offer.status}</span></div>
    <dl className="mt-4 grid gap-3 border-t border-slate-200 pt-3 text-sm sm:grid-cols-3"><div><dt className="text-slate-600">Seller SKU</dt><dd className="mt-1 font-medium">{offer.sellerSku}</dd></div><div><dt className="text-slate-600">Price</dt><dd className="mt-1 font-medium">{formatMinorUnits(offer.priceMinor)}</dd></div><div><dt className="text-slate-600">Warranty information</dt><dd className="mt-1">{offer.warranty || 'Not provided'}</dd></div></dl>
    {offer.status === 'Draft' ? <a href={`${basePath}/offers/${encodeURIComponent(offer.id)}/edit`} className="mt-3 inline-flex min-h-10 items-center text-sm font-medium text-brand">Edit draft</a> : <span className="mt-3 inline-flex min-h-10 items-center text-sm text-slate-500">Published offers are read-only</span>}
  </article>;
}

export default function SellerOffersPage({ merchantId }) {
  const access = findDemoMerchant(merchantId, demoMerchants, demoSellerMemberships);
  const { draftOffers } = useSellerOffers();
  const [query, setQuery] = useState('');
  if (!access) return <Unavailable/>;
  const offers = getOffersForMerchant(merchantId, demoMerchants, demoSellerMemberships, demoSellerOffers, draftOffers) || [];
  const normalizedQuery = query.trim().toLowerCase();
  const filteredOffers = offers.filter((offer) => {
    const labels = getOfferLabels(offer);
    return `${labels.product} ${labels.variant} ${offer.sellerSku} ${offer.status}`.toLowerCase().includes(normalizedQuery);
  });
  const basePath = `/seller/${encodeURIComponent(merchantId)}`;
  return <SellerPortalLayout merchantId={merchantId} merchant={access.merchant} merchants={getMerchantMemberships(demoMerchants, demoSellerMemberships)} active="offers">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-medium text-slate-600">{access.merchant.name}</p><h1 className="mt-1 text-3xl font-bold">Offers</h1><p className="mt-2 text-sm text-slate-600">Published fixture offers are read-only. New offers remain drafts.</p></div><a href={`${basePath}/offers/new`} className="flex min-h-11 items-center justify-center rounded-lg bg-brand px-4 font-semibold text-white">Create draft offer</a></div>
    <label htmlFor="offer-search" className="mt-6 block text-sm font-medium">Search offers</label><input id="offer-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Product, variant, SKU or status" className="mt-1 min-h-12 w-full max-w-lg rounded-lg border border-slate-400 bg-white px-3"/>
    {filteredOffers.length ? <div className="mt-5 space-y-3">{filteredOffers.map((offer) => <OfferCard key={offer.id} offer={offer} basePath={basePath}/>)}</div> : <section className="mt-5 rounded-xl border border-dashed border-slate-300 bg-white p-7 text-center"><h2 className="font-semibold">{offers.length ? 'No matching offers' : 'No offers for this store'}</h2><p className="mt-2 text-sm text-slate-600">{offers.length ? 'Try another search.' : 'Create a draft using an approved demo product.'}</p>{!offers.length && <a href={`${basePath}/offers/new`} className="mt-4 inline-flex min-h-11 items-center rounded-lg border border-brand px-4 font-medium text-brand">Create draft offer</a>}</section>}
  </SellerPortalLayout>;
}
