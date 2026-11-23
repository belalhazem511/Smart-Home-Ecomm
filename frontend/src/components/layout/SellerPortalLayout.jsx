import { useState } from 'react';
import Icon from '../Icon.jsx';

const deferredLinks = ['Catalog', 'Inventory', 'Orders', 'Shipments', 'Aftersales', 'Finance', 'Settings'];

function MerchantSelector({ merchantId, merchants }) {
  function changeMerchant(event) {
    const nextId = event.target.value;
    history.pushState({}, '', `/seller/${encodeURIComponent(nextId)}`);
    dispatchEvent(new PopStateEvent('popstate'));
  }
  return <label className="flex items-center gap-2 text-xs font-medium text-slate-600 sm:text-sm">Merchant<select value={merchantId} onChange={changeMerchant} className="min-h-10 max-w-56 rounded-md border border-slate-300 bg-white px-2 text-sm text-ink sm:px-3">{merchants.map((merchant) => <option key={merchant.id} value={merchant.id}>{merchant.name}</option>)}</select></label>;
}

function PortalNavigation({ merchantId, active }) {
  const basePath = `/seller/${encodeURIComponent(merchantId)}`;
  const links = [{ label: 'Overview', href: basePath, key: 'overview' }, { label: 'Offers', href: `${basePath}/offers`, key: 'offers' }];
  return <nav aria-label="Seller workspace navigation" className="space-y-1">{links.map((item) => <a key={item.key} href={item.href} aria-current={active === item.key ? 'page' : undefined} className={`flex min-h-10 items-center rounded-md px-3 text-sm font-medium ${active === item.key ? 'bg-blue-50 text-brand' : 'text-slate-700 hover:bg-slate-50'}`}>{item.label}</a>)}<div className="my-3 border-t border-slate-100"/><p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Coming later</p>{deferredLinks.map((label) => <span key={label} aria-disabled="true" className="flex min-h-9 items-center px-3 text-sm text-slate-400">{label}</span>)}</nav>;
}

export default function SellerPortalLayout({ merchantId, merchant, merchants, active = 'overview', children }) {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  return <div className="min-h-screen bg-canvas">
    <header className="border-b border-slate-200 bg-white"><div className="market-shell flex min-h-16 flex-wrap items-center justify-between gap-3 py-2">
      <div className="flex items-center gap-3"><a href="/seller" className="flex items-center gap-2 font-bold"><Icon name="home" className="h-6 w-6 text-brand"/><span>SMART HOME</span></a><span className="hidden border-l border-slate-200 pl-3 text-sm text-slate-500 sm:inline">Seller workspace</span></div>
      <div className="flex flex-wrap items-center gap-3"><MerchantSelector merchantId={merchantId} merchants={merchants}/><a href="/" className="min-h-10 py-2 text-sm font-medium text-brand">Storefront</a></div>
    </div></header>
    <div className="border-b border-blue-100 bg-blue-50"><div className="market-shell py-2 text-xs leading-5 text-slate-700"><strong>Seller preview.</strong> Fictional merchant data; no authentication or approval is performed.</div></div>
    <div className="market-shell grid items-start gap-4 py-4 md:grid-cols-[200px_minmax(0,1fr)] md:py-6">
      <button type="button" aria-expanded={mobileNavigationOpen} aria-controls="seller-sidebar" onClick={() => setMobileNavigationOpen((open) => !open)} className="flex min-h-11 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium md:hidden"><Icon name="menu"/>Workspace menu</button>
      <aside id="seller-sidebar" className={`${mobileNavigationOpen ? 'block' : 'hidden'} rounded-lg border border-slate-200 bg-white p-2 md:sticky md:top-4 md:block`}><div className="px-3 py-2"><p className="text-xs text-slate-500">Current merchant</p><p className="mt-0.5 truncate text-sm font-semibold">{merchant.name}</p></div><div className="mt-2 border-t border-slate-100 pt-2"><PortalNavigation merchantId={merchantId} active={active}/></div></aside>
      <main className="min-w-0" aria-label={`${merchant.name} seller ${active === 'offers' ? 'offers' : 'overview'}`}>{children}</main>
    </div>
  </div>;
}
