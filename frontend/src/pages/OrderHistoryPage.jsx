import AccountLayout from '../components/layout/AccountLayout.jsx';
import { demoOrders } from '../data/demoOrders.js';
import { formatMinorUnits } from '../data/homeContent.js';
import { getOrderSnapshotTotals } from '../lib/orders.js';

function formatDate(date) {
  return new Intl.DateTimeFormat('en-EG', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${date}T12:00:00`));
}

export default function OrderHistoryPage() {
  return <AccountLayout active="orders"><h1 className="text-3xl font-bold">Your orders</h1><p className="mt-2 text-slate-600">Order, payment, and delivery states are shown separately. All records are fictional demo snapshots.</p>{demoOrders.length ? <div className="mt-6 space-y-4">{demoOrders.map((order) => <article key={order.id} className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><a href={`/account/orders/${order.id}`} className="font-semibold text-brand hover:underline">{order.number}</a><p className="mt-1 text-sm text-slate-600">Placed {formatDate(order.placedAt)}</p></div><p className="font-semibold">{formatMinorUnits(getOrderSnapshotTotals(order).totalMinor)}</p></div><dl className="mt-4 grid gap-3 border-t border-slate-200 pt-4 text-sm sm:grid-cols-3"><div><dt className="text-slate-600">Order status</dt><dd className="mt-1 font-medium">{order.status}</dd></div><div><dt className="text-slate-600">Payment status</dt><dd className="mt-1 font-medium">{order.paymentStatus}</dd></div><div><dt className="text-slate-600">Delivery status</dt><dd className="mt-1 font-medium">{order.deliveryStatus}</dd></div></dl></article>)}</div> : <section className="mt-6 rounded-xl border border-slate-200 bg-white p-7 text-center"><h2 className="text-lg font-semibold">No orders to show</h2><p className="mt-2 text-slate-600">This demo account has no order history.</p><a href="/shop" className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-brand px-5 text-white">Browse devices</a></section>}</AccountLayout>;
}
