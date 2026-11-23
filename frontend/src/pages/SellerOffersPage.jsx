import { useState } from 'react';
import SellerPortalLayout from '../components/layout/SellerPortalLayout.jsx';
import ProductImage from '../components/ProductImage.jsx';
import { useSellerOffers } from '../contexts/SellerOffersContext.jsx';
import { demoMerchants, demoSellerMemberships, demoSellerOffers } from '../data/demoSeller.js';
import { featuredDevices, formatMinorUnits, productDetails } from '../data/smartAtlasCatalog.js';
import { findDemoMerchant, getMerchantMemberships } from '../lib/sellerOverview.js';
import { getOffersForMerchant } from '../lib/sellerOffers.js';

function getOfferLabels(offer) {
  const product = featuredDevices.find((item) => item.id === offer.productId);
  const detail = productDetails.find((item) => item.productId === offer.productId);
  const variant = detail?.variants.find((item) => item.id === offer.variantId);
  return { product: product?.name || 'Unknown product', variant: variant?.label || 'Unknown variant' };
}

function OffersUnavailable() {
  return (
    <main className="market-shell py-10 sm:py-14">
      <section className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 text-center sm:p-10">
        <span className="mx-auto block h-1 w-12 rounded-full bg-brand" />
        <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-ink">Offers unavailable</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">This merchant is unknown or is not assigned to this demo seller.</p>
        <a href="/seller" className="button-primary mt-6">Choose a merchant</a>
      </section>
    </main>
  );
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
  return (
    <SellerPortalLayout merchantId={merchantId} merchant={access.merchant} merchants={getMerchantMemberships(demoMerchants, demoSellerMemberships)} active="offers">
      <div className="portal-page-header">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">{access.merchant.name}</p>
          <h1>Offers</h1>
          <p className="mt-2 text-sm text-slate-600">Published offers are read-only. Draft edits stay in memory.</p>
        </div>
        <a href={`${basePath}/offers/new`} className="button-primary">Create draft</a>
      </div>

      <section className="mt-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
          <label className="flex min-h-10 min-w-0 flex-1 items-center gap-3 sm:max-w-lg">
            <span className="shrink-0 text-sm font-semibold text-ink">Search</span>
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Product, variant, SKU or status" className="field-control min-w-0 flex-1" />
          </label>
          <span className="rounded-full bg-brand-light px-3 py-1.5 text-xs font-semibold text-brand">{visibleOffers.length} of {offers.length} offers</span>
        </div>
        {visibleOffers.length ? (
          <div className="portal-table-wrap" role="region" aria-label="Merchant offers table" tabIndex="0">
            <table className="portal-table min-w-[760px]">
              <thead>
                <tr>
                  <th scope="col">Product and variant</th>
                  <th scope="col">Seller SKU</th>
                  <th scope="col">Price</th>
                  <th scope="col">Warranty information</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {visibleOffers.map((offer) => {
                  const labels = getOfferLabels(offer);
                  const product = featuredDevices.find((item) => item.id === offer.productId);
                  return (
                    <tr key={offer.id}>
                      <th scope="row">
                        <span className="flex items-center gap-3">
                          <ProductImage src={product?.image} alt="" className="h-12 w-12 shrink-0 rounded-xl border border-slate-200" imageClassName="h-full w-full object-contain p-1" />
                          <span>
                            <span className="block font-semibold text-ink">{labels.product}</span>
                            <span className="mt-1 block text-xs font-normal text-slate-600">{labels.variant}</span>
                          </span>
                        </span>
                      </th>
                      <td>{offer.sellerSku}</td>
                      <td className="whitespace-nowrap font-semibold tabular-nums text-ink">{formatMinorUnits(offer.priceMinor)}</td>
                      <td className="max-w-64 text-[13px] leading-5 text-slate-600">{offer.warranty || 'Not provided'}</td>
                      <td>
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${offer.status === 'Draft' ? 'bg-amber-50 text-amber-900' : 'bg-slate-100 text-slate-700'}`}>{offer.status}</span>
                      </td>
                      <td>{offer.status === 'Draft' ? <a href={`${basePath}/offers/${encodeURIComponent(offer.id)}/edit`} className="font-semibold text-brand underline">Edit draft</a> : <span className="text-xs text-slate-500">Read-only</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center sm:p-10">
            <h2 className="text-base font-bold text-ink">{offers.length ? 'No matching offers' : 'No offers for this merchant'}</h2>
            <p className="mt-2 text-sm text-slate-600">{offers.length ? 'Try another search term.' : 'Create a draft from an approved fixture product.'}</p>
            {!offers.length && <a href={`${basePath}/offers/new`} className="button-primary mt-5">Create a draft</a>}
          </section>
        )}
      </section>
    </SellerPortalLayout>
  );
}
