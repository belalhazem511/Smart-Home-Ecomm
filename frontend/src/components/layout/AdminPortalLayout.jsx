import { useState } from 'react';
import Icon from '../Icon.jsx';

const navigation = [
  { group: 'Overview', label: 'Dashboard', href: '/admin', key: 'overview' },
  { group: 'Reviews', label: 'Merchant applications', href: '/admin/reviews/sellers', key: 'merchant-reviews' },
  { group: 'Catalog', label: 'Products', href: '/admin/catalog/products', key: 'catalog-products' },
  { group: 'Catalog', label: 'Product proposals', href: '/admin/catalog/reviews', key: 'catalog-reviews' },
  { group: 'Catalog', label: 'Offer review', href: '/admin/offers', key: 'offer-reviews' },
  { group: 'Operations', label: 'Orders', href: '/admin/orders', key: 'orders' },
  { group: 'People', label: 'Users', href: '/admin/users', key: 'users' },
];
const deferredAreas = ['Finance and payouts', 'After-sales', 'Support cases', 'Access management', 'Policy and content', 'Audit and operations'];

function AdminNavigation({ active }) {
  let previousGroup = '';
  return <nav aria-label="Admin preview navigation">{navigation.map((item) => {
    const showGroup = item.group !== previousGroup;
    previousGroup = item.group;
    return <div key={item.key}>{showGroup && <p className="mb-1 mt-3 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{item.group}</p>}<a href={item.href} aria-current={active === item.key ? 'page' : undefined} className={`flex min-h-9 items-center rounded-md px-3 text-sm ${active === item.key ? 'bg-blue-50 font-semibold text-brand' : 'text-slate-700 hover:bg-slate-50'}`}>{item.label}</a></div>;
  })}<div className="my-3 border-t border-slate-100"/><p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Deferred</p>{deferredAreas.map((item) => <span key={item} aria-disabled="true" className="flex min-h-8 items-center px-3 text-xs text-slate-400">{item}</span>)}</nav>;
}

export default function AdminPortalLayout({ active, children }) {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  return <div className="min-h-screen bg-canvas">
    <header className="border-b border-slate-200 bg-white"><div className="market-shell flex min-h-16 flex-wrap items-center justify-between gap-3 py-2"><div className="flex items-center gap-3"><a href="/admin" className="flex items-center gap-2 font-bold"><Icon name="home" className="h-6 w-6 text-brand"/>SMART HOME</a><span className="hidden border-l border-slate-200 pl-3 text-sm text-slate-500 sm:inline">Admin preview</span></div><nav aria-label="Other areas" className="flex items-center gap-3 text-sm"><a href="/seller" className="min-h-10 py-2 text-slate-600 hover:text-brand">Seller preview</a><a href="/" className="min-h-10 py-2 font-medium text-brand">Storefront</a></nav></div></header>
    <div className="border-b border-blue-100 bg-blue-50"><div className="market-shell py-2 text-xs leading-5 text-slate-700"><strong>Fictional admin preview.</strong> No administrator authentication, permissions, or review actions are simulated.</div></div>
    <div className="market-shell grid items-start gap-4 py-4 md:grid-cols-[220px_minmax(0,1fr)] md:py-6"><button type="button" aria-expanded={mobileNavigationOpen} aria-controls="admin-sidebar" onClick={() => setMobileNavigationOpen((open) => !open)} className="flex min-h-11 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium md:hidden"><Icon name="menu"/>Admin menu</button><aside id="admin-sidebar" className={`${mobileNavigationOpen ? 'block' : 'hidden'} rounded-lg border border-slate-200 bg-white p-2 md:sticky md:top-4 md:block`}><AdminNavigation active={active}/></aside><main className="min-w-0">{children}</main></div>
  </div>;
}
