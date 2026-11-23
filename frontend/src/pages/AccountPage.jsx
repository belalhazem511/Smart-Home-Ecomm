import AccountLayout from '../components/layout/AccountLayout.jsx';
import { demoCustomer, demoOrders } from '../data/demoOrders.js';
import { formatMinorUnits } from '../data/smartAtlasCatalog.js';
import { getOrderCounts, getOrderSnapshotTotals } from '../lib/orders.js';
import { useAccount } from '../contexts/AccountContext.jsx';

function formatDate(date) {
  return new Intl.DateTimeFormat('en-EG', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${date}T12:00:00`));
}

export default function AccountPage() {
  const { profile } = useAccount();
  const counts = getOrderCounts(demoOrders);
  return (
    <AccountLayout active="overview">
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-blue-100 bg-brand-light px-6 py-6 sm:px-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Hello, {profile.name}</h1>
          <p className="mt-1.5 text-sm text-slate-600">{profile.email}</p>
        </div>
        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-brand ring-1 ring-inset ring-blue-100">Fictional customer</span>
      </div>

      <section aria-label="Order counts" className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          ['Orders', counts.total],
          ['Processing', counts.processing],
          ['Completed', counts.completed],
        ].map(([label, count]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-extrabold tabular-nums tracking-tight text-ink">{count}</p>
          </div>
        ))}
      </section>

      <section className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-xl font-bold tracking-tight text-ink">Recent orders</h2>
          <a href="/account/orders" className="inline-flex min-h-11 items-center text-sm font-bold text-brand hover:underline">View all orders</a>
        </div>
        {demoOrders.length ? (
          <div className="mt-4 space-y-3">
            {demoOrders.slice(0, 3).map((order) => (
              <a key={order.id} href={`/account/orders/${order.id}`} className="block rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-md">
                <div className="flex flex-wrap justify-between gap-2">
                  <span className="font-bold text-ink">{order.number}</span>
                  <span className="text-sm text-slate-500">{formatDate(order.placedAt)}</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="rounded-full bg-brand-light px-2.5 py-1 text-xs font-semibold text-brand">{order.status}</span>
                  <span className="font-bold tabular-nums text-ink">{formatMinorUnits(getOrderSnapshotTotals(order).totalMinor)}</span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-600">No demo orders yet.</p>
        )}
      </section>

      <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-bold tracking-tight text-ink">Profile and addresses</h2>
        <p className="mt-1.5 text-sm text-slate-600">{profile.phone}</p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <a href="/account/profile" className="inline-flex min-h-11 items-center font-semibold text-brand hover:underline">Edit profile</a>
          <a href="/account/addresses" className="inline-flex min-h-11 items-center font-semibold text-brand hover:underline">Manage addresses</a>
        </div>
      </section>
    </AccountLayout>
  );
}
