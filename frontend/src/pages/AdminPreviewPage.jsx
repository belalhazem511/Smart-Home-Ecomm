import AdminPortalLayout from '../components/layout/AdminPortalLayout.jsx';
import { featuredDevices, formatMinorUnits } from '../data/homeContent.js';
import ProductImage from '../components/ProductImage.jsx';
import { getOrderSnapshotTotals, findOrderById, groupSnapshotItemsBySeller } from '../lib/orders.js';
import { getAdminOverviewCounts, findAdminRecord } from '../lib/adminPreview.js';
import { demoCatalogProposals, demoMerchantApplications, demoOfferReviews, demoAdminUsers, demoOrders, demoMerchants } from '../data/demoAdmin.js';

function formatDate(date, long = false) {
  return new Intl.DateTimeFormat('en-EG', { day: 'numeric', month: long ? 'long' : 'short', year: 'numeric' }).format(new Date(`${date}T12:00:00`));
}

function ScreenHeading({ eyebrow = 'Admin preview', title, description, action }) {
  return <div className="portal-page-header"><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{eyebrow}</p><h1>{title}</h1>{description && <p className="mt-1 max-w-2xl text-sm leading-5 text-slate-600">{description}</p>}</div>{action}</div>;
}

function StatusLabel({ status }) {
  const waiting = status === 'Awaiting review';
  return <span className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold ${waiting ? 'bg-amber-50 text-amber-900' : 'bg-slate-100 text-slate-700'}`}>{status}</span>;
}

function TableFrame({ label, columns, children }) {
  return <div className="portal-table-wrap mt-4" role="region" aria-label={label} tabIndex="0"><table className="portal-table min-w-[680px]"><thead><tr>{columns.map((column) => <th key={column} scope="col">{column}</th>)}</tr></thead><tbody>{children}</tbody></table></div>;
}

function EmptyTableRow({ columns, children }) {
  return <tr><td colSpan={columns} className="px-4 py-8 text-center text-sm text-slate-600">{children}</td></tr>;
}

function AdminUnavailable({ message = 'This record is not available in the fictional admin fixtures.', backHref = '/admin' }) {
  return <section className="mt-5 rounded-lg border border-slate-200 bg-white p-5"><h2 className="font-semibold">Record unavailable</h2><p className="mt-1 text-sm text-slate-600">{message}</p><a href={backHref} className="mt-3 inline-flex min-h-10 items-center font-semibold text-brand underline">Return to the list</a></section>;
}

function AdminDashboard() {
  const counts = getAdminOverviewCounts({ merchantApplications: demoMerchantApplications, users: demoAdminUsers, catalogProposals: demoCatalogProposals, offerReviews: demoOfferReviews, orders: demoOrders });
  const cards = [
    ['Merchant applications', counts.merchantApplicationsAwaitingReview, '/admin/reviews/sellers'],
    ['Catalog proposals', counts.catalogProposalsAwaitingReview, '/admin/catalog/reviews'],
    ['Offers awaiting review', counts.offersAwaitingReview, '/admin/offers'],
    ['Fictional users', counts.users, '/admin/users'],
    ['Orders to inspect', counts.orders, '/admin/orders'],
  ];
  return <><ScreenHeading title="Overview" description="Queue counts are derived from fictional preview records."/><section aria-label="Admin preview counts" className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-5">{cards.map(([label, count, href]) => <a key={label} href={href} className="min-h-24 rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300"><p className="text-[13px] leading-5 text-slate-600">{label}</p><p className="mt-1 text-2xl font-bold tabular-nums">{count}</p><span className="mt-2 inline-flex text-xs font-semibold text-brand">Open list</span></a>)}</section>
    <section className="mt-5 rounded-lg border border-slate-200 bg-white p-4"><div className="flex flex-wrap items-end justify-between gap-2"><div><h2 className="font-semibold">Recent customer orders</h2><p className="mt-1 text-xs text-slate-600">Totals use purchase-time snapshots.</p></div><a href="/admin/orders" className="text-sm font-semibold text-brand">View all</a></div><TableFrame label="Recent demo customer orders" columns={['Order', 'Placed', 'Order status', 'Payment', 'Total']}>
      {demoOrders.slice(0, 4).map((order) => <tr key={order.id}><th scope="row" className="px-4 py-3"><a href={`/admin/orders/${encodeURIComponent(order.id)}`} className="font-semibold text-brand underline">{order.number}</a></th><td className="whitespace-nowrap px-4 py-3">{formatDate(order.placedAt)}</td><td className="px-4 py-3">{order.status.replace(' (demo)', '')}</td><td className="px-4 py-3">{order.paymentStatus.replace(' (demo)', '')}</td><td className="whitespace-nowrap px-4 py-3 font-semibold">{formatMinorUnits(getOrderSnapshotTotals(order).totalMinor)}</td></tr>)}
    </TableFrame></section></>;
}

function MerchantApplications({ applicationId = '' }) {
  const base = '/admin/reviews/sellers';
  if (applicationId) {
    const application = findAdminRecord(demoMerchantApplications, applicationId);
    if (!application) return <><ScreenHeading title="Merchant application"/><AdminUnavailable backHref={base}/></>;
    return <><a href={base} className="text-sm font-semibold text-brand underline">Back to applications</a><ScreenHeading eyebrow="Merchant review" title={application.businessName} description="Fictional application fixture. Review actions and private documents are not included."/><dl className="mt-5 grid max-w-2xl gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-2"><div><dt className="text-xs text-slate-500">Application reference</dt><dd className="mt-1 text-sm font-medium">{application.id}</dd></div><div><dt className="text-xs text-slate-500">Submitted</dt><dd className="mt-1 text-sm font-medium">{formatDate(application.submittedAt, true)}</dd></div><div><dt className="text-xs text-slate-500">City</dt><dd className="mt-1 text-sm font-medium">{application.city}</dd></div><div><dt className="text-xs text-slate-500">Preview status</dt><dd className="mt-1"><StatusLabel status={application.status}/></dd></div><div className="sm:col-span-2"><dt className="text-xs text-slate-500">Documents</dt><dd className="mt-1 text-sm text-slate-600">No documents are included in this preview fixture.</dd></div></dl></>;
  }
  const columns = 4;
  return <><ScreenHeading title="Merchant applications" description="Fictional seller applications for queue-layout review. Approve, reject and request-information actions are deferred."/><TableFrame label="Demo merchant application review queue" columns={['Business', 'City', 'Submitted', 'Preview status']}>
    {demoMerchantApplications.map((application) => <tr key={application.id}><th scope="row" className="px-4 py-3"><a href={`${base}/${encodeURIComponent(application.id)}`} className="font-semibold text-brand underline">{application.businessName}</a></th><td className="px-4 py-3">{application.city}</td><td className="whitespace-nowrap px-4 py-3">{formatDate(application.submittedAt)}</td><td className="px-4 py-3"><StatusLabel status={application.status}/></td></tr>)}{!demoMerchantApplications.length && <EmptyTableRow columns={columns}>No applications in this preview.</EmptyTableRow>}
  </TableFrame></>;
}

function UsersPage({ userId = '' }) {
  const base = '/admin/users';
  if (userId) {
    const user = findAdminRecord(demoAdminUsers, userId);
    if (!user) return <><ScreenHeading title="User record"/><AdminUnavailable backHref={base}/></>;
    return <><a href={base} className="text-sm font-semibold text-brand underline">Back to users</a><ScreenHeading eyebrow="User record" title={user.name} description="Fictional preview record. This view does not grant or change access."/><dl className="mt-5 grid max-w-2xl gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-2"><div><dt className="text-xs text-slate-500">User reference</dt><dd className="mt-1 text-sm font-medium">{user.id}</dd></div><div><dt className="text-xs text-slate-500">Preview type</dt><dd className="mt-1 text-sm font-medium">{user.accountType}</dd></div><div className="sm:col-span-2"><dt className="text-xs text-slate-500">Email</dt><dd className="mt-1 text-sm">{user.email}</dd></div><div className="sm:col-span-2"><dt className="text-xs text-slate-500">Merchant memberships</dt><dd className="mt-1 text-sm">{user.memberships.length ? user.memberships.join(', ') : 'None in fixture'}</dd></div></dl></>;
  }
  return <><ScreenHeading title="Users" description="Small fictional sample of customer and seller preview records. Search and account-management actions are deferred."/><TableFrame label="Fictional admin user list" columns={['User', 'Email', 'Preview type', 'Memberships']}>
    {demoAdminUsers.map((user) => <tr key={user.id}><th scope="row" className="px-4 py-3"><a href={`${base}/${encodeURIComponent(user.id)}`} className="font-semibold text-brand underline">{user.name}</a></th><td className="px-4 py-3">{user.email}</td><td className="px-4 py-3">{user.accountType}</td><td className="px-4 py-3">{user.memberships.length ? user.memberships.join(', ') : 'None'}</td></tr>)}
  </TableFrame></>;
}

function ProductsPage() {
  const columns = 4;
  return <><ScreenHeading title="Catalog products" description="Canonical product fixtures are read-only here. Product and variant editing is deferred." action={<a href="/admin/catalog/reviews" className="inline-flex min-h-10 items-center rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold">Review proposals</a>}/><TableFrame label="Canonical product fixture list" columns={['Product', 'Category', 'Specifications', 'Fixture price']}>
    {featuredDevices.map((product) => <tr key={product.id}><th scope="row" className="px-4 py-3 font-semibold"><span className="flex items-center gap-3"><ProductImage src={product.image} alt="" className="h-12 w-12 shrink-0 rounded border border-slate-200" imageClassName="h-full w-full object-contain p-1"/>{product.name}</span></th><td className="px-4 py-3">{product.category}</td><td className="max-w-sm px-4 py-3 text-xs leading-5 text-slate-600">{product.detail.replace('Â·', '|')}</td><td className="whitespace-nowrap px-4 py-3">{Number.isFinite(product.price) ? formatMinorUnits(product.priceMinor) : 'No available offers'}</td></tr>)}{!featuredDevices.length && <EmptyTableRow columns={columns}>No product fixtures.</EmptyTableRow>}
  </TableFrame></>;
}

function CatalogProposals({ proposalId = '' }) {
  const base = '/admin/catalog/reviews';
  if (proposalId) {
    const proposal = findAdminRecord(demoCatalogProposals, proposalId);
    if (!proposal) return <><ScreenHeading title="Catalog proposal"/><AdminUnavailable backHref={base}/></>;
    return <><a href={base} className="text-sm font-semibold text-brand underline">Back to proposals</a><ScreenHeading eyebrow="Catalog proposal review" title={proposal.productName} description="Fictional seller submission. Approval and canonical-catalog changes are not available."/><dl className="mt-5 grid max-w-2xl gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-2"><div><dt className="text-xs text-slate-500">Proposal reference</dt><dd className="mt-1 text-sm font-medium">{proposal.id}</dd></div><div><dt className="text-xs text-slate-500">Submitted by</dt><dd className="mt-1 text-sm font-medium">{proposal.submittedBy}</dd></div><div><dt className="text-xs text-slate-500">Category</dt><dd className="mt-1 text-sm">{proposal.category}</dd></div><div><dt className="text-xs text-slate-500">Submitted</dt><dd className="mt-1 text-sm">{formatDate(proposal.submittedAt, true)}</dd></div><div className="sm:col-span-2"><dt className="text-xs text-slate-500">Status</dt><dd className="mt-1"><StatusLabel status={proposal.status}/></dd></div></dl></>;
  }
  const columns = 4;
  return <><ScreenHeading title="Catalog proposals" description="Review queue examples use separate fictional proposal identities; they do not modify canonical products."/><TableFrame label="Catalog proposal review queue" columns={['Proposal', 'Category', 'Submitted by', 'Status']}>
    {demoCatalogProposals.map((proposal) => <tr key={proposal.id}><th scope="row" className="px-4 py-3"><a href={`${base}/${encodeURIComponent(proposal.id)}`} className="font-semibold text-brand underline">{proposal.productName}</a><span className="mt-1 block text-xs font-normal text-slate-500">{proposal.id}</span></th><td className="px-4 py-3">{proposal.category}</td><td className="px-4 py-3">{proposal.submittedBy}</td><td className="px-4 py-3"><StatusLabel status={proposal.status}/></td></tr>)}{!demoCatalogProposals.length && <EmptyTableRow columns={columns}>No proposals in this preview.</EmptyTableRow>}
  </TableFrame></>;
}

function OfferReviews() {
  const columns = 5;
  function merchantName(merchantId) { return demoMerchants.find((merchant) => merchant.id === merchantId)?.name || 'Unknown merchant'; }
  return <><ScreenHeading title="Offer review" description="Fictional moderation examples. No offer is approved, published, or copied into customer-facing data here."/><TableFrame label="Seller offer review queue" columns={['Merchant', 'Product and variant', 'Seller SKU', 'Submitted price', 'Status']}>
    {demoOfferReviews.map((offer) => <tr key={offer.id}><th scope="row" className="px-4 py-3 font-medium">{merchantName(offer.merchantId)}<span className="mt-1 block text-xs font-normal text-slate-500">{offer.id}</span></th><td className="px-4 py-3">{offer.productName}<span className="mt-1 block text-xs text-slate-500">{offer.variant}</span></td><td className="px-4 py-3">{offer.sellerSku}</td><td className="whitespace-nowrap px-4 py-3">{formatMinorUnits(offer.priceMinor)}</td><td className="px-4 py-3"><StatusLabel status={offer.status}/></td></tr>)}{!demoOfferReviews.length && <EmptyTableRow columns={columns}>No offer review examples.</EmptyTableRow>}
  </TableFrame></>;
}

function OrdersPage({ orderId = '' }) {
  const base = '/admin/orders';
  if (orderId) {
    const order = findOrderById(demoOrders, orderId);
    if (!order) return <><ScreenHeading title="Order inspection"/><AdminUnavailable backHref={base}/></>;
    const groups = groupSnapshotItemsBySeller(order);
    const totals = getOrderSnapshotTotals(order);
    return <><a href={base} className="text-sm font-semibold text-brand underline">Back to orders</a><ScreenHeading eyebrow="Fictional order snapshot" title={order.number} description={`Placed ${formatDate(order.placedAt, true)}. Historical values are preserved from the purchase snapshot.`}/><dl className="mt-4 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-3"><div><dt className="text-xs text-slate-500">Order status</dt><dd className="mt-1 text-sm font-semibold">{order.status.replace(' (demo)', '')}</dd></div><div><dt className="text-xs text-slate-500">Payment status</dt><dd className="mt-1 text-sm font-semibold">{order.paymentStatus.replace(' (demo)', '')}</dd></div><div><dt className="text-xs text-slate-500">Delivery status</dt><dd className="mt-1 text-sm font-semibold">{order.deliveryStatus.replace(' (demo)', '')}</dd></div></dl><div className="mt-4 space-y-3">{groups.map((group) => <section key={group.sellerId} className="rounded-lg border border-slate-200 bg-white p-4"><h2 className="text-sm font-semibold">Seller: {group.sellerName}</h2><div className="mt-3 divide-y divide-slate-100">{group.items.map((item, index) => <div key={`${item.productNameSnapshot}-${index}`} className="grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-3 py-3 text-sm"><ProductImage src={item.imageSnapshot} alt="" className="h-14 w-14 rounded border border-slate-200" imageClassName="h-full w-full object-contain p-1"/><div><p className="font-medium">{item.productNameSnapshot}</p><p className="mt-1 text-xs text-slate-600">{item.variantNameSnapshot} | Quantity {item.quantity} | Purchase-time unit price {formatMinorUnits(item.unitPriceMinorSnapshot)}</p></div><p className="font-semibold">{formatMinorUnits(item.lineTotalMinorSnapshot)}</p></div>)}</div>{group.delivery && <div className="mt-2 border-t border-slate-100 pt-3 text-xs leading-5 text-slate-600">Delivery: {group.delivery.methodSnapshot.replace('Â·', '|')} | {group.delivery.statusSnapshot.replace(' (demo)', '')} | Purchase-time charge {formatMinorUnits(group.delivery.chargeMinorSnapshot)}</div>}</section>)}</div><section className="mt-4 ml-auto max-w-sm rounded-lg border border-slate-200 bg-white p-4"><h2 className="text-sm font-semibold">Purchase-time totals</h2><div className="mt-3 flex justify-between text-sm"><span>Items</span><span>{formatMinorUnits(totals.itemsSubtotalMinor)}</span></div>{totals.discountMinor > 0 && <div className="mt-2 flex justify-between text-sm"><span>Discount</span><span>−{formatMinorUnits(totals.discountMinor)}</span></div>}<div className="mt-2 flex justify-between text-sm"><span>Delivery</span><span>{formatMinorUnits(totals.deliverySubtotalMinor)}</span></div><div className="mt-3 flex justify-between border-t border-slate-200 pt-3 text-sm font-bold"><span>Total</span><span>{formatMinorUnits(totals.totalMinor)}</span></div></section></>;
  }
  const columns = 5;
  return <><ScreenHeading title="Orders" description="Fictional customer orders shown for read-only inspection. Snapshot totals are not recalculated from current offers."/><TableFrame label="Platform demo orders" columns={['Order', 'Placed', 'Order status', 'Payment', 'Purchase total']}>
    {demoOrders.map((order) => <tr key={order.id}><th scope="row" className="px-4 py-3"><a href={`${base}/${encodeURIComponent(order.id)}`} className="font-semibold text-brand underline">{order.number}</a></th><td className="whitespace-nowrap px-4 py-3">{formatDate(order.placedAt)}</td><td className="px-4 py-3">{order.status.replace(' (demo)', '')}</td><td className="px-4 py-3">{order.paymentStatus.replace(' (demo)', '')}</td><td className="whitespace-nowrap px-4 py-3 font-semibold">{formatMinorUnits(getOrderSnapshotTotals(order).totalMinor)}</td></tr>)}{!demoOrders.length && <EmptyTableRow columns={columns}>No orders in this preview.</EmptyTableRow>}
  </TableFrame></>;
}

function decodeRouteId(id) {
  try { return decodeURIComponent(id); } catch { return id; }
}

function resolveAdminPage(pathname) {
  if (pathname === '/admin') return { active: 'overview', page: <AdminDashboard/> };
  if (pathname === '/admin/reviews/sellers') return { active: 'merchant-reviews', page: <MerchantApplications/> };
  const application = pathname.match(/^\/admin\/reviews\/sellers\/([^/]+)$/);
  if (application) return { active: 'merchant-reviews', page: <MerchantApplications applicationId={decodeRouteId(application[1])}/> };
  if (pathname === '/admin/users') return { active: 'users', page: <UsersPage/> };
  const user = pathname.match(/^\/admin\/users\/([^/]+)$/);
  if (user) return { active: 'users', page: <UsersPage userId={decodeRouteId(user[1])}/> };
  if (pathname === '/admin/catalog/products') return { active: 'catalog-products', page: <ProductsPage/> };
  if (pathname === '/admin/catalog/reviews') return { active: 'catalog-reviews', page: <CatalogProposals/> };
  const proposal = pathname.match(/^\/admin\/catalog\/reviews\/([^/]+)$/);
  if (proposal) return { active: 'catalog-reviews', page: <CatalogProposals proposalId={decodeRouteId(proposal[1])}/> };
  if (pathname === '/admin/offers') return { active: 'offer-reviews', page: <OfferReviews/> };
  if (pathname === '/admin/orders') return { active: 'orders', page: <OrdersPage/> };
  const order = pathname.match(/^\/admin\/orders\/([^/]+)$/);
  if (order) return { active: 'orders', page: <OrdersPage orderId={decodeRouteId(order[1])}/> };
  return { active: '', page: <><ScreenHeading title="Destination not available" description="This admin destination is not included in the current preview."/><AdminUnavailable message="Use an implemented admin preview section or return to the overview."/></> };
}

export default function AdminPreviewPage({ pathname }) {
  const { active, page } = resolveAdminPage(pathname);
  return <AdminPortalLayout active={active}>{page}</AdminPortalLayout>;
}
