import { useState } from 'react';
import Icon from '../Icon.jsx';

function MerchantSelector({ merchantId, merchants }) {
  function changeMerchant(event) {
    const nextId = event.target.value;
    history.pushState({}, '', `/seller/${encodeURIComponent(nextId)}`);
    dispatchEvent(new PopStateEvent('popstate'));
  }
  return <label className="flex items-center gap-2 text-xs font-medium text-slate-600 sm:text-sm">Merchant<select value={merchantId} onChange={changeMerchant} className="field-control min-h-10 max-w-48 px-2 text-sm sm:max-w-56 sm:px-3">{merchants.map((merchant) => <option key={merchant.id} value={merchant.id}>{merchant.name}</option>)}</select></label>;
}

function PortalNavigation({ merchantId, active }) {
  const basePath = `/seller/${encodeURIComponent(merchantId)}`;
  const links = [{ label: 'Overview', href: basePath, key: 'overview' }, { label: 'Offers', href: `${basePath}/offers`, key: 'offers' }];
  return <nav aria-label="Seller workspace navigation" className="space-y-1">{links.map((item) => <a key={item.key} href={item.href} aria-current={active === item.key ? 'page' : undefined} className={`flex min-h-10 items-center rounded-md px-3 text-sm font-medium ${active === item.key ? 'bg-blue-50 text-blue-900' : 'text-slate-700 hover:bg-slate-50'}`}>{item.label}</a>)}</nav>;
}

export default function SellerPortalLayout({ merchantId, merchant, merchants, active = 'overview', children }) {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  return <div className="portal-frame">
    <header className="portal-topbar"><div className="flex min-h-16 flex-wrap items-center justify-between gap-3 px-4 sm:px-6"><div className="flex items-center gap-3"><a href="/seller" className="flex items-center gap-2 text-sm font-bold"><Icon name="home" className="h-6 w-6 text-brand"/><span>SMART HOME</span></a><span className="hidden border-l border-slate-200 pl-3 text-sm text-slate-500 sm:inline">Seller workspace</span></div>
      <div className="flex flex-wrap items-center gap-2"><MerchantSelector merchantId={merchantId} merchants={merchants}/><details className="portal-demo"><summary>Demo preview<Icon name="info" className="h-4 w-4"/></summary><p className="portal-demo-copy">Fictional seller data only. This preview does not authenticate sellers or establish access control or approval.</p></details><a href="/" className="button-quiet">Storefront</a></div>
    </div></header>
    <div className="portal-workspace">
      <div className="md:hidden"><button type="button" aria-expanded={mobileNavigationOpen} aria-controls="seller-sidebar" onClick={() => setMobileNavigationOpen((open) => !open)} className="button-secondary w-full justify-start"><Icon name="menu"/>Workspace navigation</button></div>
      <aside id="seller-sidebar" className={`portal-sidebar ${mobileNavigationOpen ? 'block' : 'hidden'} md:block`}><div className="px-3 py-2"><p className="text-xs font-medium text-slate-500">Current merchant</p><p className="mt-0.5 truncate text-sm font-semibold">{merchant.name}</p></div><div className="mt-2 border-t border-slate-100 pt-2"><PortalNavigation merchantId={merchantId} active={active}/></div></aside>
      <main className="portal-content" aria-label={`${merchant.name} seller ${active === 'offers' ? 'offers' : 'overview'}`}>{children}</main>
    </div>
  </div>;
}
