import StoreHeader from '../StoreHeader.jsx';

const navigation = [
  { label: 'Overview', href: '/account', active: 'overview' },
  { label: 'Orders', href: '/account/orders', active: 'orders' },
  { label: 'Profile', href: '/account/profile', active: 'profile' },
  { label: 'Addresses', href: '/account/addresses', active: 'addresses' },
];

export default function AccountLayout({ active, children }) {
  return <div className="min-h-screen"><StoreHeader/><main className="mx-auto max-w-content px-4 py-7 md:px-6 lg:px-8"><div className="rounded-xl border border-blue-100 bg-blue-50 p-4"><p className="font-semibold">Fictional demo account</p><p className="mt-1 text-sm text-slate-700">No sign-in is required. This preview does not establish authentication or access control. Changes stay in memory for this demo session.</p></div><div className="mt-6 grid gap-6 md:grid-cols-[210px_1fr]"><nav aria-label="Account navigation" className="flex gap-2 overflow-x-auto md:block md:space-y-2">{navigation.map((item) => <a key={item.href} href={item.href} aria-current={active === item.active ? 'page' : undefined} className={`flex min-h-11 shrink-0 items-center rounded-lg px-4 font-medium ${active === item.active ? 'bg-blue-50 text-brand' : 'hover:bg-slate-100'}`}>{item.label}</a>)}<span className="flex min-h-11 shrink-0 items-center px-4 text-sm text-slate-500">Security · Later</span></nav><div className="min-w-0">{children}</div></div></main></div>;
}
