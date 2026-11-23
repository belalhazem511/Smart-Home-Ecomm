import AccountLayout from '../components/layout/AccountLayout.jsx';
import { demoOrders } from '../data/demoOrders.js';
import { formatMinorUnits } from '../data/smartAtlasCatalog.js';
import { getOrderSnapshotTotals } from '../lib/orders.js';

function formatDate(date) {
  return new Intl.DateTimeFormat('en-EG', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${date}T12:00:00`));
}

export default function OrderHistoryPage() {
  return (
    <AccountLayout active="orders">
      <div className="rounded-2xl border border-blue-100 bg-brand-light px-6 py-7 sm:px-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Your orders</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Order, payment, and delivery states are shown separately. All records are fictional demo snapshots.</p>
      </div>

      {demoOrders.length ? (
        <div className="mt-6 space-y-4">
          {demoOrders.map((order) => (
            <article key={order.id} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <a href={`/account/orders/${order.id}`} className="text-lg font-bold text-brand hover:underline">{order.number}</a>
                  <p className="mt-1 text-sm text-slate-500">Placed {formatDate(order.placedAt)}</p>
                </div>
                <p className="text-lg font-extrabold tabular-nums text-ink">{formatMinorUnits(getOrderSnapshotTotals(order).totalMinor)}</p>
              </div>
              <dl className="mt-5 grid gap-4 border-t border-slate-100 pt-5 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Order status</dt>
                  <dd className="mt-1.5 font-semibold text-ink">{order.status}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Payment status</dt>
                  <dd className="mt-1.5 font-semibold text-ink">{order.paymentStatus}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Delivery status</dt>
                  <dd className="mt-1.5 font-semibold text-ink">{order.deliveryStatus}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      ) : (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <h2 className="text-lg font-bold text-ink">No orders to show</h2>
          <p className="mt-2 text-sm text-slate-600">This demo account has no order history.</p>
          <a href="/shop" className="button-primary mt-5">Browse devices</a>
        </section>
      )}
    </AccountLayout>
  );
}
