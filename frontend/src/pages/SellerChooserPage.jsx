import Icon from '../components/Icon.jsx';
import { demoMerchants, demoSellerMemberships } from '../data/demoSeller.js';
import { getMerchantMemberships } from '../lib/sellerOverview.js';

export default function SellerChooserPage() {
  const merchants = getMerchantMemberships(demoMerchants, demoSellerMemberships);
  return <div className="min-h-screen bg-canvas"><header className="border-b border-slate-200 bg-white"><div className="market-shell flex min-h-16 items-center justify-between gap-3"><a href="/" className="flex items-center gap-2 font-bold"><Icon name="home" className="h-6 w-6 text-brand"/>SMART HOME</a><span className="text-sm text-slate-600">Seller preview</span></div></header><main className="market-shell py-7 sm:py-10">
    <p className="text-xs font-semibold uppercase tracking-wide text-brand">Seller workspace</p><h1 className="mt-2 text-2xl font-bold sm:text-3xl">Choose a demo merchant</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">These fictional memberships show merchant-scoped seller pages. This preview does not sign in a seller, verify ownership, or approve a store.</p>
    <section aria-label="Assigned demo merchants" className="mt-6 grid gap-3 sm:grid-cols-2">{merchants.map((merchant) => <article key={merchant.id} className="rounded-lg border border-slate-200 bg-white p-5"><p className="text-xs text-slate-500">{merchant.region} | Demo membership</p><h2 className="mt-1 text-lg font-semibold">{merchant.name}</h2><div className="mt-4 flex flex-wrap gap-2"><a href={`/seller/${encodeURIComponent(merchant.id)}`} className="inline-flex min-h-10 items-center rounded-md bg-brand px-4 text-sm font-semibold text-white">Open seller workspace</a><a href={`/seller/${encodeURIComponent(merchant.id)}/offers`} className="inline-flex min-h-10 items-center rounded-md border border-slate-300 px-4 text-sm font-semibold">View offers</a></div></article>)}</section>
    {!merchants.length && <p className="mt-5 rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">No demo merchant memberships are assigned.</p>}
  </main></div>;
}
