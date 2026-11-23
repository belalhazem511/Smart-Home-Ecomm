import SellerPortalLayout from '../components/layout/SellerPortalLayout.jsx';
import { demoMerchants, demoSellerMemberships, demoSellerOrders } from '../data/demoSeller.js';
import { getMerchantMemberships, getSellerOverview } from '../lib/sellerOverview.js';

function formatDate(date) {
  return new Intl.DateTimeFormat('en-EG', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${date}T12:00:00`));
}

function SellerUnavailable() {
  return <main className="market-shell py-8"><section className="max-w-2xl rounded-lg border border-slate-200 bg-white p-6"><h1 className="text-xl font-bold">Merchant unavailable</h1><p className="mt-2 text-sm leading-6 text-slate-600">This merchant is unknown or is not assigned to this demo seller. Another merchant was not selected automatically.</p><a href="/seller" className="mt-4 inline-flex min-h-11 items-center rounded-md bg-brand px-4 text-sm font-semibold text-white">Choose a merchant</a></section></main>;
}

function cleanStatus(status) { return status.replace(' (demo)', ''); }

export default function SellerDashboardPage({ merchantId }) {
  const overview = getSellerOverview(merchantId, demoMerchants, demoSellerMemberships, demoSellerOrders);
  if (!overview) return <SellerUnavailable/>;
  const { merchant, orders, counts } = overview;
  const memberships = getMerchantMemberships(demoMerchants, demoSellerMemberships);
  const metrics = [['Seller orders', counts.total], ['Pending payment', counts.pendingPayment], ['Ready for processing', counts.readyForProcessing], ['In fulfillment', counts.inFulfillment]];
  return <SellerPortalLayout merchantId={merchantId} merchant={merchant} merchants={memberships}>
    <div className="portal-page-header"><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{merchant.region}</p><h1>Overview</h1><p className="mt-1 text-sm text-slate-600">Order activity for {merchant.name}</p></div><a href={`/seller/${encodeURIComponent(merchantId)}/offers`} className="button-secondary">Manage offers</a></div>
    <section aria-label="Seller order counts" className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">{metrics.map(([label, count]) => <article key={label} className="min-h-24 rounded-lg border border-slate-200 bg-white p-4"><p className="text-[13px] text-slate-600">{label}</p><p className="mt-1 text-2xl font-bold tabular-nums">{count}</p></article>)}</section>
    <section className="mt-6"><div className="flex flex-wrap items-end justify-between gap-2 pb-3"><div><h2 className="text-base font-semibold">Recent seller orders</h2><p className="mt-1 text-[13px] text-slate-600">Seller records are separate from customer order history.</p></div><span className="text-xs text-slate-500">{orders.length} records</span></div>
      {orders.length ? <div className="portal-table-wrap" role="region" aria-label="Recent seller orders table" tabIndex="0"><table className="portal-table min-w-[720px]"><thead><tr><th scope="col">Seller order</th><th scope="col">Date</th><th scope="col">Items</th><th scope="col">Order status</th><th scope="col">Payment</th><th scope="col">Processing</th></tr></thead><tbody>{orders.slice(0, 8).map((order) => <tr key={order.id}><th scope="row" className="font-semibold">{order.sellerOrderNumber}</th><td className="whitespace-nowrap">{formatDate(order.createdAt)}</td><td className="tabular-nums">{order.itemCount}</td><td>{cleanStatus(order.orderStatus)}</td><td className={order.paymentStatus.startsWith('Pending') ? 'font-semibold text-amber-800' : 'text-slate-700'}>{cleanStatus(order.paymentStatus)}</td><td>{cleanStatus(order.processingStatus)}</td></tr>)}</tbody></table></div> : <p className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">No seller orders for this merchant.</p>}
    </section>
  </SellerPortalLayout>;
}
