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

function OffersUnavailable() {
  return <main className="market-shell py-8"><section className="max-w-2xl rounded-lg border border-slate-200 bg-white p-6"><h1 className="text-xl font-bold">Offers unavailable</h1><p className="mt-2 text-sm text-slate-600">This merchant is unknown or is not assigned to this demo seller.</p><a href="/seller" className="mt-4 inline-flex min-h-11 items-center rounded-md bg-brand px-4 text-sm font-semibold text-white">Choose a merchant</a></section></main>;
}

export default function SellerOffersPage({ merchantId }) {
  const access = findDemoMerchant(merchantId, demoMerchants, demoSellerMemberships);
  const { draftOffers } = useSellerOffers();
  const [query, setQuery] = useState('');
  if (!access) return <OffersUnavailable/>;
  const offers = getOffersForMerchant(merchantId, demoMerchants, demoSellerMemberships, demoSellerOffers, draftOffers) || [];
  const normalizedQuery = query.trim().toLowerCase();
  const visibleOffers = offers.filter((offer) => {
    const labels = getOfferLabels(offer);
    return `${labels.product} ${labels.variant} ${offer.sellerSku} ${offer.status}`.toLowerCase().includes(normalizedQuery);
  });
  const basePath = `/seller/${encodeURIComponent(merchantId)}`;
  return <SellerPortalLayout merchantId={merchantId} merchant={access.merchant} merchants={getMerchantMemberships(demoMerchants, demoSellerMemberships)} active="offers">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{access.merchant.name}</p><h1 className="mt-1 text-2xl font-bold sm:text-3xl">Offers</h1><p className="mt-1 text-sm text-slate-600">Published fixture offers are read-only. Draft edits stay in memory.</p></div><a href={`${basePath}/offers/new`} className="inline-flex min-h-10 items-center rounded-md bg-brand px-4 text-sm font-semibold text-white">Create draft</a></div>
    <section className="mt-5 rounded-lg border border-slate-200 bg-white"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4"><label className="flex min-h-10 min-w-0 flex-1 items-center gap-2 sm:max-w-md"><span className="shrink-0 text-sm font-medium">Search</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Product, variant, SKU or status" className="min-h-10 min-w-0 flex-1 rounded-md border border-slate-300 px-3 text-sm"/></label><span className="text-xs text-slate-500">{visibleOffers.length} of {offers.length} offers</span></div>
      {visibleOffers.length ? <div className="overflow-x-auto" role="region" aria-label="Merchant offers table" tabIndex="0"><table className="w-full min-w-[760px] border-collapse text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-600"><tr><th scope="col" className="px-4 py-3 font-semibold">Product and variant</th><th scope="col" className="px-4 py-3 font-semibold">Seller SKU</th><th scope="col" className="px-4 py-3 font-semibold">Price</th><th scope="col" className="px-4 py-3 font-semibold">Warranty information</th><th scope="col" className="px-4 py-3 font-semibold">Status</th><th scope="col" className="px-4 py-3 font-semibold">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{visibleOffers.map((offer) => { const labels = getOfferLabels(offer); return <tr key={offer.id} className="align-top"><th scope="row" className="px-4 py-3"><span className="block font-semibold">{labels.product}</span><span className="mt-1 block text-xs font-normal text-slate-600">{labels.variant}</span></th><td className="px-4 py-3">{offer.sellerSku}</td><td className="whitespace-nowrap px-4 py-3 font-semibold">{formatMinorUnits(offer.priceMinor)}</td><td className="max-w-64 px-4 py-3 text-xs leading-5 text-slate-600">{offer.warranty || 'Not provided'}</td><td className="px-4 py-3"><span className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold ${offer.status === 'Draft' ? 'bg-amber-50 text-amber-900' : 'bg-slate-100 text-slate-700'}`}>{offer.status}</span></td><td className="px-4 py-3">{offer.status === 'Draft' ? <a href={`${basePath}/offers/${encodeURIComponent(offer.id)}/edit`} className="font-semibold text-brand underline">Edit draft</a> : <span className="text-xs text-slate-500">Read-only</span>}</td></tr>; })}</tbody></table></div> : <div className="p-6"><h2 className="font-semibold">{offers.length ? 'No matching offers' : 'No offers for this merchant'}</h2><p className="mt-1 text-sm text-slate-600">{offers.length ? 'Try another search term.' : 'Create a draft from an approved fixture product.'}</p>{!offers.length && <a href={`${basePath}/offers/new`} className="mt-3 inline-flex min-h-10 items-center rounded-md border border-slate-300 px-3 text-sm font-semibold">Create a draft</a>}</div>}
    </section>
  </SellerPortalLayout>;
}
