import StoreHeader from '../components/StoreHeader.jsx';
import { demoMerchants, demoSellerMemberships } from '../data/demoSeller.js';
import { getMerchantMemberships } from '../lib/sellerOverview.js';

export default function SellerChooserPage() {
  const merchants = getMerchantMemberships(demoMerchants, demoSellerMemberships);
  return <div className="min-h-screen"><StoreHeader/><main className="mx-auto max-w-content px-4 py-8 md:px-6 lg:px-8"><p className="text-sm font-semibold uppercase tracking-wide text-brand">Demo seller portal</p><h1 className="mt-2 text-3xl font-bold">Choose a demo store</h1><p className="mt-2 max-w-2xl text-slate-600">These fictional memberships demonstrate merchant-scoped navigation only. They do not authenticate a seller or represent an approved real store.</p><section aria-label="Assigned demo merchants" className="mt-6 grid gap-4 sm:grid-cols-2">{merchants.map((merchant) => <article key={merchant.id} className="rounded-xl border border-slate-200 bg-white p-5"><h2 className="text-xl font-semibold">{merchant.name}</h2><p className="mt-1 text-sm text-slate-600">{merchant.region} · {merchant.membershipLabel}</p><a href={`/seller/${encodeURIComponent(merchant.id)}`} className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-brand px-5 font-semibold text-white">View demo overview</a></article>)}</section>{!merchants.length && <p className="mt-6 rounded-xl border border-slate-200 bg-white p-6 text-slate-600">No demo merchant memberships are assigned.</p>}</main></div>;
}
