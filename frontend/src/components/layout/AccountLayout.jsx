import StoreHeader from '../StoreHeader.jsx';
import StoreFooter from '../StoreFooter.jsx';

const navigation = [
  { label: 'Overview', href: '/account', active: 'overview' },
  { label: 'Orders', href: '/account/orders', active: 'orders' },
  { label: 'Profile', href: '/account/profile', active: 'profile' },
  { label: 'Addresses', href: '/account/addresses', active: 'addresses' },
];

export default function AccountLayout({ active, children }) {
  return <div className="min-h-screen"><StoreHeader/><main className="market-shell py-5 sm:py-7">
    <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3"><p className="text-sm font-semibold">Demo customer preview</p><p className="mt-1 text-xs leading-5 text-slate-700">Fictional account data. This page does not authenticate users or protect account routes. Personal changes stay in memory for this session.</p></div>
    <div className="mt-5 grid items-start gap-5 md:grid-cols-[200px_minmax(0,1fr)]"><nav aria-label="Account navigation" className="flex gap-1 overflow-x-auto rounded-lg border border-slate-200 bg-white p-2 md:block md:space-y-1">{navigation.map((item) => <a key={item.href} href={item.href} aria-current={active === item.active ? 'page' : undefined} className={`flex min-h-10 shrink-0 items-center rounded-md px-3 text-sm font-medium ${active === item.active ? 'bg-blue-50 text-brand' : 'text-slate-700 hover:bg-slate-50'}`}>{item.label}</a>)}<span className="flex min-h-10 shrink-0 items-center px-3 text-xs text-slate-500">Security and privacy tools later</span></nav><div className="min-w-0">{children}</div></div>
  </main><StoreFooter/></div>;
}
