import { useState } from 'react';
import Icon from '../Icon.jsx';

const deferredLinks = ['Catalog', 'Offers', 'Inventory', 'Orders', 'Shipments', 'Aftersales', 'Finance', 'Settings'];

function MerchantSelector({ merchantId, merchants }) {
  function changeMerchant(event) {
    const nextId = event.target.value;
    history.pushState({}, '', `/seller/${encodeURIComponent(nextId)}`);
    dispatchEvent(new PopStateEvent('popstate'));
  }
  return <label className="flex items-center gap-2 text-sm font-medium">Demo merchant<select value={merchantId} onChange={changeMerchant} className="min-h-11 max-w-56 rounded-lg border border-slate-400 bg-white px-3">{merchants.map((merchant) => <option key={merchant.id} value={merchant.id}>{merchant.name}</option>)}</select></label>;
}

export default function SellerPortalLayout({ merchantId, merchant, merchants, children }) {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const overviewPath = `/seller/${encodeURIComponent(merchantId)}`;
  return <div className="min-h-screen bg-canvas"><header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6 lg:px-8"><a href="/seller" className="flex items-center gap-2 font-extrabold"><Icon name="home" className="h-7 w-7 text-brand"/><span>SMART HOME</span><span className="text-sm font-medium text-slate-500">Seller demo</span></a><div className="flex flex-wrap items-center gap-3"><MerchantSelector merchantId={merchantId} merchants={merchants}/><a href="/" className="min-h-11 py-3 text-sm font-medium text-brand">Storefront</a></div></div><div className="border-t border-slate-100 bg-blue-50 px-4 py-2 text-center text-sm text-slate-700">Demo seller preview · No authentication or seller approval is performed.</div></header><div className="mx-auto max-w-content px-4 md:px-6 lg:px-8"><button type="button" aria-expanded={mobileNavigationOpen} aria-controls="seller-navigation" onClick={() => setMobileNavigationOpen(!mobileNavigationOpen)} className="mt-4 flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 font-medium md:hidden"><Icon name="menu"/>Seller navigation</button><div className="grid gap-6 py-5 md:grid-cols-[220px_1fr] md:py-7"><aside id="seller-navigation" className={`${mobileNavigationOpen ? 'block' : 'hidden'} rounded-xl border border-slate-200 bg-white p-3 md:block`}><nav aria-label="Seller portal navigation" className="space-y-1"><a href={overviewPath} aria-current="page" className="flex min-h-11 items-center rounded-lg bg-blue-50 px-3 font-semibold text-brand">Overview</a>{deferredLinks.map((item) => <span key={item} aria-disabled="true" className="flex min-h-11 items-center justify-between rounded-lg px-3 text-sm text-slate-500"><span>{item}</span><span className="text-xs">Later</span></span>)}</nav></aside><main className="min-w-0" aria-label={`${merchant.name} seller overview`}>{children}</main></div></div></div>;
}
