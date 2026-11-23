import { useState } from 'react';
import Icon from './Icon.jsx';
import { categories } from '../data/homeContent.js';
import { useCart } from '../contexts/CartContext.jsx';

export default function StoreHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalUnits } = useCart();
  return <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
    <div className="border-b border-slate-100 bg-slate-50"><div className="market-shell flex min-h-9 items-center justify-between text-xs text-slate-600"><span>Smart home essentials, clearly chosen</span><div className="flex gap-4"><a href="/seller" className="hover:text-brand">Seller preview</a><span>Egypt | EGP</span></div></div></div>
    <div className="market-shell flex min-h-[68px] items-center gap-3 py-2">
      <button type="button" aria-label={menuOpen ? 'Close categories' : 'Open categories'} aria-expanded={menuOpen} aria-controls="store-categories" onClick={() => setMenuOpen((open) => !open)} className="grid min-h-11 min-w-11 place-items-center rounded-lg border border-slate-200 md:hidden"><Icon name={menuOpen ? 'close' : 'menu'}/></button>
      <a href="/" className="flex shrink-0 items-center gap-2 text-base font-extrabold tracking-tight sm:text-lg"><Icon name="home" className="h-7 w-7 text-brand"/><span>SMART HOME</span></a>
      <form action="/search" method="get" role="search" className="hidden min-w-0 flex-1 md:flex">
        <label className="sr-only" htmlFor="search-desktop">Search products</label><div className="flex h-11 w-full max-w-2xl overflow-hidden rounded-lg border border-slate-300 bg-white focus-within:border-brand"><input id="search-desktop" name="q" className="min-w-0 flex-1 px-4 text-sm outline-none" placeholder="Search products, brands or protocols"/><button type="submit" aria-label="Search" className="grid w-12 place-items-center bg-slate-50 text-slate-700 hover:bg-slate-100"><Icon name="search"/></button></div>
      </form>
      <nav aria-label="Account and cart" className="ml-auto flex shrink-0 items-center gap-1 sm:gap-3"><a href="/sign-in" className="flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-medium hover:bg-slate-50"><Icon name="user"/><span className="hidden sm:inline">Account</span></a><a href="/cart" aria-label={`Cart, ${totalUnits} items`} className="flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-medium hover:bg-slate-50"><Icon name="cart"/><span className="hidden sm:inline">Cart</span><span aria-live="polite" className="min-w-6 rounded-md bg-blue-50 px-1.5 py-0.5 text-center text-xs font-bold text-brand">{totalUnits}</span></a></nav>
    </div>
    <form action="/search" method="get" role="search" className="market-shell flex gap-2 pb-2 md:hidden"><label className="sr-only" htmlFor="search-mobile">Search products</label><div className="flex h-11 min-w-0 flex-1 overflow-hidden rounded-lg border border-slate-300"><input id="search-mobile" name="q" className="min-w-0 flex-1 px-3 text-sm outline-none" placeholder="Search products and protocols"/><button type="submit" aria-label="Search" className="grid w-11 place-items-center bg-slate-50"><Icon name="search"/></button></div></form>
    <nav id="store-categories" aria-label="Product categories" className={`${menuOpen ? 'block' : 'hidden'} border-t border-slate-100 md:block`}><div className="market-shell flex gap-1 overflow-x-auto py-1.5">{[{ name: 'Shop all', slug: '' }, ...categories.map((item) => ({ name: item.name, slug: item.name.toLowerCase() }))].map((item) => <a key={item.name} onClick={() => setMenuOpen(false)} href={item.slug ? `/categories/${item.slug}` : '/shop'} className="flex min-h-10 shrink-0 items-center rounded-md px-3 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-brand">{item.name}</a>)}</div></nav>
  </header>;
}
