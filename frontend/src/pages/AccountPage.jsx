import AccountLayout from '../components/layout/AccountLayout.jsx';
import { demoCustomer, demoOrders } from '../data/demoOrders.js';
import { formatMinorUnits } from '../data/homeContent.js';
import { getOrderCounts, getOrderSnapshotTotals } from '../lib/orders.js';
import { useAccount } from '../contexts/AccountContext.jsx';

function formatDate(date) {
  return new Intl.DateTimeFormat('en-EG', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${date}T12:00:00`));
}

export default function AccountPage() {
  const { profile } = useAccount();
  const counts = getOrderCounts(demoOrders);
  return <AccountLayout active="overview"><div className="flex flex-wrap items-start justify-between gap-3"><div><h1 className="text-3xl font-bold">Hello, {profile.name}</h1><p className="mt-1 text-slate-600">{profile.email}</p></div><span className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700">Fictional customer</span></div><section aria-label="Order counts" className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">{[['Orders', counts.total], ['Processing', counts.processing], ['Completed', counts.completed]].map(([label, count]) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-sm text-slate-600">{label}</p><p className="mt-1 text-2xl font-bold">{count}</p></div>)}</section><section className="mt-8"><div className="flex items-end justify-between gap-3"><h2 className="text-xl font-semibold">Recent orders</h2><a href="/account/orders" className="min-h-11 py-2 text-sm font-medium text-brand">View all orders</a></div>{demoOrders.length ? <div className="mt-3 space-y-3">{demoOrders.slice(0, 3).map((order) => <a key={order.id} href={`/account/orders/${order.id}`} className="block rounded-xl border border-slate-200 bg-white p-4 hover:border-blue-300"><div className="flex flex-wrap justify-between gap-2"><span className="font-semibold">{order.number}</span><span className="text-sm text-slate-600">{formatDate(order.placedAt)}</span></div><div className="mt-3 flex flex-wrap justify-between gap-2 text-sm"><span>{order.status}</span><span className="font-semibold">{formatMinorUnits(getOrderSnapshotTotals(order).totalMinor)}</span></div></a>)}</div> : <p className="mt-3 rounded-xl border border-slate-200 bg-white p-6 text-slate-600">No demo orders yet.</p>}</section><section className="mt-7 rounded-xl border border-slate-200 bg-white p-5"><h2 className="font-semibold">Profile and addresses</h2><p className="mt-1 text-sm text-slate-600">{profile.phone}</p><div className="mt-3 flex gap-4 text-sm"><a href="/account/profile" className="text-brand">Edit profile</a><a href="/account/addresses" className="text-brand">Manage addresses</a></div></section></AccountLayout>;
}
