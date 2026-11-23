import SellerPortalLayout from '../components/layout/SellerPortalLayout.jsx';
import { demoMerchants, demoSellerMemberships, demoSellerOrders } from '../data/demoSeller.js';
import { getMerchantMemberships, getSellerOverview } from '../lib/sellerOverview.js';

function formatDate(date) {
  return new Intl.DateTimeFormat('en-EG', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${date}T12:00:00`));
}

function SellerUnavailable() {
  return (
    <main className="market-shell py-10 sm:py-14">
      <section className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 text-center sm:p-10">
        <span className="mx-auto block h-1 w-12 rounded-full bg-brand" />
        <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-ink">Merchant unavailable</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">This merchant is unknown or is not assigned to this demo seller. Another merchant was not selected automatically.</p>
        <a href="/seller" className="button-primary mt-6">Choose a merchant</a>
      </section>
    </main>
  );
}

function cleanStatus(status) { return status.replace(' (demo)', ''); }

export default function SellerDashboardPage({ merchantId }) {
  const overview = getSellerOverview(merchantId, demoMerchants, demoSellerMemberships, demoSellerOrders);
  if (!overview) return <SellerUnavailable/>;
  const { merchant, orders, counts } = overview;
  const memberships = getMerchantMemberships(demoMerchants, demoSellerMemberships);
  const metrics = [['Seller orders', counts.total], ['Pending payment', counts.pendingPayment], ['Ready for processing', counts.readyForProcessing], ['In fulfillment', counts.inFulfillment]];
  return (
    <SellerPortalLayout merchantId={merchantId} merchant={merchant} merchants={memberships}>
      <div className="portal-page-header">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">{merchant.region}</p>
          <h1>Overview</h1>
          <p className="mt-2 text-sm text-slate-600">Order activity for {merchant.name}</p>
        </div>
        <a href={`/seller/${encodeURIComponent(merchantId)}/offers`} className="button-primary">Manage offers</a>
      </div>

      <section aria-label="Seller order counts" className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {metrics.map(([label, count]) => (
          <article key={label} className="min-h-24 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <p className="text-[13px] font-medium text-slate-600">{label}</p>
            <p className="mt-2 text-2xl font-extrabold tracking-tight text-ink tabular-nums">{count}</p>
            <span className="mt-3 block h-1 w-10 rounded-full bg-brand/25" />
          </article>
        ))}
      </section>

      <section className="mt-7">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-base font-bold tracking-tight text-ink">Recent seller orders</h2>
            <p className="mt-1 text-[13px] text-slate-600">Seller records are separate from customer order history.</p>
          </div>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">{orders.length} records</span>
        </div>
        {orders.length ? (
          <div className="portal-table-wrap" role="region" aria-label="Recent seller orders table" tabIndex="0">
            <table className="portal-table min-w-[720px]">
              <thead>
                <tr>
                  <th scope="col">Seller order</th>
                  <th scope="col">Date</th>
                  <th scope="col">Items</th>
                  <th scope="col">Order status</th>
                  <th scope="col">Payment</th>
                  <th scope="col">Processing</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 8).map((order) => (
                  <tr key={order.id}>
                    <th scope="row" className="font-semibold">{order.sellerOrderNumber}</th>
                    <td className="whitespace-nowrap">{formatDate(order.createdAt)}</td>
                    <td className="tabular-nums">{order.itemCount}</td>
                    <td><span className="inline-flex rounded-full bg-brand-light px-2.5 py-1 text-xs font-semibold text-brand">{cleanStatus(order.orderStatus)}</span></td>
                    <td className={order.paymentStatus.startsWith('Pending') ? 'font-semibold text-amber-800' : 'text-slate-700'}>{cleanStatus(order.paymentStatus)}</td>
                    <td>{cleanStatus(order.processingStatus)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-sm text-slate-600">No seller orders for this merchant.</p>
          </section>
        )}
      </section>
    </SellerPortalLayout>
  );
}
