import AccountLayout from '../components/layout/AccountLayout.jsx';
import ProductImage from '../components/ProductImage.jsx';
import { demoOrders } from '../data/demoOrders.js';
import { formatMinorUnits } from '../data/smartAtlasCatalog.js';
import { findOrderById, getOrderSnapshotTotals, groupSnapshotItemsBySeller } from '../lib/orders.js';

function formatDate(date) {
  return new Intl.DateTimeFormat('en-EG', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${date}T12:00:00`));
}

function UnknownOrder() {
  return (
    <AccountLayout active="orders">
      <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Order not found</h1>
        <p className="mt-3 text-sm text-slate-600">That order ID is not present in the demo order history.</p>
        <a href="/account/orders" className="button-primary mt-6">Back to orders</a>
      </section>
    </AccountLayout>
  );
}

export default function OrderDetailPage({ orderId }) {
  const order = findOrderById(demoOrders, orderId);
  if (!order) return <UnknownOrder/>;
  const groups = groupSnapshotItemsBySeller(order);
  const totals = getOrderSnapshotTotals(order);
  return (
    <AccountLayout active="orders">
      <a href="/account/orders" className="text-sm font-bold text-brand hover:underline">← Back to orders</a>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Order {order.number}</h1>
          <p className="mt-2 text-sm text-slate-600">Placed {formatDate(order.placedAt)} · Fictional demo record</p>
        </div>
        <span className="rounded-full bg-brand-light px-3 py-1.5 text-sm font-semibold text-brand ring-1 ring-inset ring-blue-100">{order.status}</span>
      </div>

      <dl className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-3 sm:p-6">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Order status</dt>
          <dd className="mt-1.5 font-bold text-ink">{order.status}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Payment status</dt>
          <dd className="mt-1.5 font-bold text-ink">{order.paymentStatus}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Delivery status</dt>
          <dd className="mt-1.5 font-bold text-ink">{order.deliveryStatus}</dd>
        </div>
      </dl>

      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-ink">Purchased items</h2>
        {groups.map((group) => (
          <article key={group.sellerId} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h3 className="text-sm font-bold text-ink">Sold by {group.sellerName}</h3>
            <div className="mt-4 divide-y divide-slate-100">
              {group.items.map((item, index) => (
                <div key={`${item.productNameSnapshot}-${index}`} className="grid gap-4 py-4 sm:grid-cols-[72px_minmax(0,1fr)_auto] sm:items-center">
                  <ProductImage src={item.imageSnapshot} alt={item.productNameSnapshot} className="h-[72px] w-[72px] rounded-xl border border-slate-200 bg-white" imageClassName="h-full w-full object-contain p-2" />
                  <div className="min-w-0">
                    <p className="font-semibold text-ink">{item.productNameSnapshot}</p>
                    <p className="mt-1 text-sm text-slate-600">Variant: {item.variantNameSnapshot} · Quantity: {item.quantity}</p>
                    <p className="mt-1 text-xs text-slate-500">Purchase-time unit price: {formatMinorUnits(item.unitPriceMinorSnapshot)}</p>
                  </div>
                  <p className="font-bold tabular-nums text-ink sm:text-right">{formatMinorUnits(item.lineTotalMinorSnapshot)}</p>
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between border-t border-slate-100 pt-4 text-sm">
              <span className="text-slate-600">Seller items subtotal</span>
              <span className="font-bold tabular-nums text-ink">{formatMinorUnits(group.itemsSubtotalMinor)}</span>
            </div>
            {group.discountMinor > 0 && (
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-slate-600">Seller discount at purchase</span>
                <span className="font-semibold text-brand">-{formatMinorUnits(group.discountMinor)}</span>
              </div>
            )}
            {group.delivery && (
              <div className="mt-5 rounded-xl bg-brand-light p-4">
                <h4 className="text-sm font-bold text-ink">Delivery</h4>
                <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-slate-500">Service</dt>
                    <dd className="mt-1 font-semibold text-ink">{group.delivery.methodSnapshot}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Delivery status</dt>
                    <dd className="mt-1 font-semibold text-ink">{group.delivery.statusSnapshot}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Tracking</dt>
                    <dd className="mt-1 font-semibold text-ink">{group.delivery.trackingSnapshot}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Charge at purchase</dt>
                    <dd className="mt-1 font-semibold text-ink">{formatMinorUnits(group.delivery.chargeMinorSnapshot)}</dd>
                  </div>
                </dl>
              </div>
            )}
          </article>
        ))}
      </section>

      <section className="mt-7 ml-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-extrabold tracking-tight text-ink">Purchase-time totals</h2>
        <div className="mt-5 space-y-2.5 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Items</span>
            <span className="font-semibold tabular-nums">{formatMinorUnits(totals.itemsSubtotalMinor)}</span>
          </div>
          {totals.discountMinor > 0 && (
            <div className="flex justify-between">
              <span className="text-slate-600">Discount</span>
              <span className="font-semibold text-brand">-{formatMinorUnits(totals.discountMinor)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-slate-600">Delivery</span>
            <span className="font-semibold tabular-nums">{formatMinorUnits(totals.deliverySubtotalMinor)}</span>
          </div>
        </div>
        <div className="mt-5 flex justify-between border-t border-slate-100 pt-5 text-lg font-extrabold text-ink">
          <span>Total at purchase</span>
          <span className="tabular-nums text-brand">{formatMinorUnits(totals.totalMinor)}</span>
        </div>
      </section>

      <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">Order actions such as cancellation, returns, and support are deferred.</div>
    </AccountLayout>
  );
}
