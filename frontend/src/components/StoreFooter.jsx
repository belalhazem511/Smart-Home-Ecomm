import Icon from './Icon.jsx';
import { categories } from '../data/smartAtlasCatalog.js';

const trustBadges = [
  { icon: 'security', title: '100% Authentic', text: 'Genuine products' },
  { icon: 'user', title: 'Trusted by Thousands', text: 'Loved by customers' },
  { icon: 'light', title: 'Top Rated Store', text: 'High-quality gadgets' },
  { icon: 'hub', title: 'Price Match Guarantee', text: 'Best prices always' },
];

export default function StoreFooter() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white">
      <div className="market-shell grid gap-6 border-b border-slate-100 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {trustBadges.map((badge) => (
          <div key={badge.title} className="trust-item">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-light text-brand"><Icon name={badge.icon} className="h-5 w-5" /></span>
            <div><p className="text-sm font-semibold text-ink">{badge.title}</p><p className="text-xs text-slate-500">{badge.text}</p></div>
          </div>
        ))}
      </div>

      <div className="market-shell grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <a href="/" className="flex items-center gap-2 text-lg font-extrabold text-ink">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white"><Icon name="hub" className="h-5 w-5" /></span>
            Smart<span className="text-brand">Atlas</span>
          </a>
          <p className="mt-3 max-w-xs text-sm leading-6 text-slate-600">Discover smart-home essentials built for modern living. Compare devices, find great deals, and upgrade with confidence.</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-ink">Shop</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600"><li><a href="/shop" className="hover:text-brand">All products</a></li>{categories.slice(0, 3).map((category) => <li key={category.name}><a href={`/categories/${category.slug || category.name.toLowerCase()}`} className="hover:text-brand">{category.name}</a></li>)}</ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-ink">Your account</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600"><li><a href="/sign-in" className="hover:text-brand">Sign in</a></li><li><a href="/account/orders" className="hover:text-brand">Order history</a></li><li><a href="/cart" className="hover:text-brand">Shopping cart</a></li></ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-ink">Marketplace</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600"><li><a href="/seller" className="hover:text-brand">Seller preview</a></li><li><a href="/admin" className="hover:text-brand">Admin preview</a></li><li><a href="/shop" className="hover:text-brand">Deals</a></li></ul>
        </div>
      </div>

      <div className="border-t border-slate-100">
        <div className="market-shell flex flex-wrap items-center justify-between gap-2 py-4 text-xs text-slate-500">
          <span>SmartAtlas Marketplace | English | EGP</span>
          <span>© 2026 SmartAtlas. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
