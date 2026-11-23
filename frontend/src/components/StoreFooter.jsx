import Icon from './Icon.jsx';
import { categories } from '../data/homeContent.js';

export default function StoreFooter() {
  return <footer className="mt-12 border-t border-slate-200 bg-white"><div className="market-shell grid gap-8 py-8 sm:grid-cols-2 lg:grid-cols-4">
    <div><a href="/" className="flex items-center gap-2 font-extrabold"><Icon name="home" className="h-6 w-6 text-brand"/>SMART HOME</a><p className="mt-3 max-w-xs text-sm text-slate-600">A practical place to compare smart-home essentials.</p></div>
    <div><h2 className="text-sm font-semibold">Shop</h2><ul className="mt-3 space-y-2 text-sm text-slate-600"><li><a href="/shop" className="hover:text-brand">All products</a></li>{categories.slice(0, 3).map((category) => <li key={category.name}><a href={`/categories/${category.name.toLowerCase()}`} className="hover:text-brand">{category.name}</a></li>)}</ul></div>
    <div><h2 className="text-sm font-semibold">Your account</h2><ul className="mt-3 space-y-2 text-sm text-slate-600"><li><a href="/sign-in" className="hover:text-brand">Sign in</a></li><li><a href="/account/orders" className="hover:text-brand">Order history</a></li><li><a href="/cart" className="hover:text-brand">Shopping cart</a></li></ul></div>
    <div><h2 className="text-sm font-semibold">Marketplace</h2><ul className="mt-3 space-y-2 text-sm text-slate-600"><li><a href="/seller" className="hover:text-brand">Seller preview</a></li><li><a href="/admin" className="hover:text-brand">Admin preview</a></li></ul></div>
  </div><div className="border-t border-slate-100"><div className="market-shell py-4 text-xs text-slate-500">Smart Home Marketplace | English | EGP</div></div></footer>;
}
