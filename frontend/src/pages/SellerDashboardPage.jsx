import SellerPortalLayout from '../components/layout/SellerPortalLayout.jsx';
import { demoMerchants, demoSellerMemberships, demoSellerOrders } from '../data/demoSeller.js';
import { getMerchantMemberships, getSellerOverview } from '../lib/sellerOverview.js';

function formatDate(date) {
  return new Intl.DateTimeFormat('en-EG', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${date}T12:00:00`));
}

function SellerUnavailable() {
  return <div className="mx-auto max-w-content px-4 py-10"><section className="rounded-xl border border-amber-200 bg-white p-7"><h1 className="text-2xl font-bold">Store unavailable</h1><p className="mt-2 text-slate-700">This merchant ID is unknown or is not assigned to the demo seller. No other store was selected.</p><a href="/seller" className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-brand px-5 font-semibold text-white">Choose an assigned demo store</a></section></div>;
}

export default function SellerDashboardPage({ merchantId }) {
  const overview = getSellerOverview(merchantId, demoMerchants, demoSellerMemberships, demoSellerOrders);
  if (!overview) return <SellerUnavailable />;
  const { merchant, orders, counts } = overview;
  const memberships = getMerchantMemberships(demoMerchants, demoSellerMemberships);
  const cards = [['Seller orders', counts.total], ['Pending payment', counts.pendingPayment], ['Ready for processing', counts.readyForProcessing], ['In fulfillment', counts.inFulfillment]];
  return <SellerPortalLayout merchantId={merchantId} merchant={merchant} merchants={memberships}>
    <div><p className="text-sm font-medium text-slate-600">{merchant.region} | Demo membership</p><h1 className="mt-1 text-3xl font-bold">{merchant.name}</h1><p className="mt-2 text-slate-600">Read-only overview. Counts are calculated from this store's fictional seller orders.</p></div>
    <section aria-label="Seller order counts" className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, count]) => <article key={label} className="rounded-xl border border-slate-200 bg-white p-4"><h2 className="text-sm font-medium text-slate-600">{label}</h2><p className="mt-2 text-3xl font-bold">{count}</p></article>)}</section>
    <section className="mt-8"><h2 className="text-xl font-semibold">Recent seller orders</h2><p className="mt-1 text-sm text-slate-600">Seller order records are distinct from customer order history. No state changes are available here.</p>{orders.length ? <div className="mt-4 space-y-3">{orders.slice(0, 5).map((order) => <article key={order.id} className="rounded-xl border border-slate-200 bg-white p-4"><div className="flex flex-wrap items-start justify-between gap-2"><div><h3 className="font-semibold">Seller order {order.sellerOrderNumber}</h3><p className="mt-1 text-sm text-slate-600">{formatDate(order.createdAt)} | {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-sm">{order.orderStatus}</span></div><dl className="mt-4 grid gap-3 border-t border-slate-200 pt-3 text-sm sm:grid-cols-2"><div><dt className="text-slate-600">Payment status</dt><dd className="mt-1 font-medium">{order.paymentStatus}</dd></div><div><dt className="text-slate-600">Processing status</dt><dd className="mt-1 font-medium">{order.processingStatus}</dd></div></dl></article>)}</div> : <p className="mt-4 rounded-xl border border-slate-200 bg-white p-6 text-slate-600">No seller orders for this demo store.</p>}</section>
    <p className="mt-7 rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-600">Catalog, inventory, order management, shipments, after-sales, finance, and settings are deferred. Offers are available for this demo merchant.</p>
  </SellerPortalLayout>;
}
