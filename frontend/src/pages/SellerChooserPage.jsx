import Icon from '../components/Icon.jsx';
import { demoMerchants, demoSellerMemberships } from '../data/demoSeller.js';
import { getMerchantMemberships } from '../lib/sellerOverview.js';

export default function SellerChooserPage() {
  const merchants = getMerchantMemberships(demoMerchants, demoSellerMemberships);
  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-slate-200 bg-white">
        <div className="market-shell flex min-h-16 flex-wrap items-center justify-between gap-3">
          <a href="/" className="flex items-center gap-2.5 text-base font-extrabold tracking-tight text-ink">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white"><Icon name="home" className="h-5 w-5" /></span>
            Smart<span className="text-brand">Atlas</span>
          </a>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-light px-3 py-1.5 text-xs font-semibold text-brand">
            <Icon name="info" className="h-4 w-4" />
            Seller preview · fictional data
          </span>
        </div>
      </header>
      <main className="market-shell py-8 sm:py-12">
        <section className="hero-gradient overflow-hidden rounded-3xl px-6 py-9 text-white sm:px-10 sm:py-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-100 ring-1 ring-inset ring-white/20">
            <span className="h-2 w-2 rounded-full bg-brand" />Seller workspace
          </span>
          <h1 className="mt-5 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">Choose a demo merchant</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">These fictional memberships show merchant-scoped seller pages. This preview does not sign in a seller, verify ownership, or approve a store.</p>
        </section>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-ink sm:text-xl">Assigned merchants</h2>
            <p className="mt-1 text-sm text-slate-600">Select a membership to open its merchant-scoped workspace.</p>
          </div>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">{merchants.length} demo {merchants.length === 1 ? 'membership' : 'memberships'}</span>
        </div>

        <section aria-label="Assigned demo merchants" className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {merchants.map((merchant) => (
            <article key={merchant.id} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg">
              <div className="flex items-center gap-3">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-slate-200 bg-brand-light/50">
                  <img src={merchant.logo} alt="" className="h-12 w-12 rounded-lg p-1" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{merchant.region} | Demo membership</p>
                  <h3 className="mt-1 truncate text-lg font-bold text-ink">{merchant.name}</h3>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <a href={`/seller/${encodeURIComponent(merchant.id)}`} className="button-primary flex-1">Open seller workspace</a>
                <a href={`/seller/${encodeURIComponent(merchant.id)}/offers`} className="button-secondary flex-1">View offers</a>
              </div>
            </article>
          ))}
        </section>

        {!merchants.length && (
          <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-sm text-slate-600">No demo merchant memberships are assigned.</p>
          </section>
        )}
      </main>
    </div>
  );
}
