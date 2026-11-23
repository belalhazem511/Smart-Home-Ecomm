import Icon from '../Icon.jsx';
import StoreHeader from '../StoreHeader.jsx';
import StoreFooter from '../StoreFooter.jsx';

const navigation = [
  { label: 'Overview', href: '/account', active: 'overview', icon: 'hub' },
  { label: 'Orders', href: '/account/orders', active: 'orders', icon: 'cart' },
  { label: 'Profile', href: '/account/profile', active: 'profile', icon: 'user' },
  { label: 'Addresses', href: '/account/addresses', active: 'addresses', icon: 'home' },
];

export default function AccountLayout({ active, children }) {
  return (
    <div className="min-h-screen bg-canvas">
      <StoreHeader />
      <main className="market-shell py-5 sm:py-7">
        <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-brand-light px-5 py-4">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand text-white"><Icon name="info" className="h-4 w-4" /></span>
          <div><p className="text-sm font-bold text-ink">Demo customer preview</p><p className="mt-0.5 text-xs leading-5 text-slate-600">Fictional account data. This page does not authenticate users or protect account routes. Personal changes stay in memory for this session.</p></div>
        </div>

        <div className="mt-6 grid items-start gap-6 md:grid-cols-[230px_minmax(0,1fr)]">
          <nav aria-label="Account navigation" className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-3 md:block md:space-y-1">
            <p className="mb-2 hidden px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 md:block">My account</p>
            {navigation.map((item) => (
              <a key={item.href} href={item.href} aria-current={active === item.active ? 'page' : undefined} className={`flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition ${active === item.active ? 'bg-brand text-white shadow-md shadow-blue-200' : 'text-slate-700 hover:bg-brand-light hover:text-brand'}`}>
                <Icon name={item.icon} className="h-5 w-5" />{item.label}
              </a>
            ))}
            <span className="mt-3 hidden border-t border-slate-100 px-3 pt-3 text-xs text-slate-400 md:block">Security and privacy tools later</span>
          </nav>
          <div className="min-w-0">{children}</div>
        </div>
      </main>
      <StoreFooter />
    </div>
  );
}
