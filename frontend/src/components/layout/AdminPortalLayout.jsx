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

function AdminNavigation({ active }) {
  let previousGroup = '';
  return <nav aria-label="Admin preview navigation">{navigation.map((item) => {
    const showGroup = item.group !== previousGroup;
    previousGroup = item.group;
    return <div key={item.key}>{showGroup && <p className="mb-1 mt-3 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{item.group}</p>}<a href={item.href} aria-current={active === item.key ? 'page' : undefined} className={`flex min-h-9 items-center rounded-md px-3 text-sm ${active === item.key ? 'bg-blue-50 font-semibold text-brand' : 'text-slate-700 hover:bg-slate-50'}`}>{item.label}</a></div>;
  })}</nav>;
}

export default function AdminPortalLayout({ active, children }) {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  return <div className="portal-frame">
    <header className="portal-topbar"><div className="flex min-h-16 flex-wrap items-center justify-between gap-3 px-4 sm:px-6"><div className="flex items-center gap-3"><a href="/admin" className="flex items-center gap-2 text-sm font-bold"><Icon name="home" className="h-6 w-6 text-brand"/>SMART HOME</a><span className="hidden border-l border-slate-200 pl-3 text-sm text-slate-500 sm:inline">Admin workspace</span></div><div className="flex items-center gap-2"><details className="portal-demo"><summary>Demo preview<Icon name="info" className="h-4 w-4"/></summary><p className="portal-demo-copy">Fictional read-only records. This preview does not authenticate administrators, grant permissions, or perform review actions.</p></details><a href="/seller" className="button-quiet">Seller preview</a><a href="/" className="button-quiet">Storefront</a></div></div></header>
    <div className="portal-workspace"><div className="md:hidden"><button type="button" aria-expanded={mobileNavigationOpen} aria-controls="admin-sidebar" onClick={() => setMobileNavigationOpen((open) => !open)} className="button-secondary w-full justify-start"><Icon name="menu"/>Workspace navigation</button></div><aside id="admin-sidebar" className={`portal-sidebar ${mobileNavigationOpen ? 'block' : 'hidden'} md:block`}><AdminNavigation active={active}/></aside><main className="portal-content">{children}</main></div>
  </div>;
}
