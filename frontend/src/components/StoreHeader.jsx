import { useState } from 'react';
import Icon from './Icon.jsx';
import { categories } from '../data/homeContent.js';
import { useCart } from '../contexts/CartContext.jsx';

export default function StoreHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalUnits } = useCart();
  return <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
    <div className="border-b border-slate-100 bg-slate-50"><div className="market-shell flex min-h-6 items-center justify-between gap-3 text-xs text-slate-600"><span aria-describedby="demo-data-details">Demo environment · Fictional data</span><span id="demo-data-details" className="sr-only">Product images, specifications, sellers, and transactions are illustrative demo records.</span><div className="flex items-center gap-4"><a href="/seller" className="font-medium hover:text-brand">Sell with us</a><span className="hidden sm:inline">Egypt · EGP</span></div></div></div>
    <div className="market-shell grid min-h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-2">
      <button type="button" aria-label={menuOpen ? 'Close categories' : 'Open categories'} aria-expanded={menuOpen} aria-controls="store-categories" onClick={() => setMenuOpen((open) => !open)} className="grid min-h-11 min-w-11 place-items-center rounded-lg border border-slate-200 md:hidden"><Icon name={menuOpen ? 'close' : 'menu'}/></button>
      <a href="/" className="flex shrink-0 items-center gap-2 text-sm font-extrabold tracking-tight sm:text-base"><Icon name="home" className="h-6 w-6 text-brand"/><span className="hidden min-[380px]:inline">SMART HOME</span></a>
      <form action="/search" method="get" role="search" className="col-span-3 row-start-2 flex min-w-0 md:col-span-1 md:col-start-2 md:row-start-1">
        <label className="sr-only" htmlFor="search-products">Search products</label><div className="flex h-11 w-full overflow-hidden rounded-lg border border-slate-300 bg-white focus-within:border-brand focus-within:ring-2 focus-within:ring-blue-100"><input id="search-products" name="q" className="market-search-input min-w-0 flex-1 text-base" placeholder="Search smart-home devices"/><button type="submit" aria-label="Search" className="grid w-12 shrink-0 place-items-center bg-slate-100 text-slate-800 hover:bg-slate-200"><Icon name="search"/></button></div>
      </form>
      <nav aria-label="Account and cart" className="col-start-3 row-start-1 flex shrink-0 items-center gap-1 sm:gap-2 md:col-start-3"><a href="/sign-in" aria-label="Sign in to your account" className="flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold hover:bg-slate-50"><Icon name="user"/><span className="hidden lg:inline">Sign in</span></a><a href="/cart" aria-label={`Cart, ${totalUnits} items`} className="flex min-h-11 items-center gap-1 rounded-lg px-2 text-sm font-semibold hover:bg-slate-50"><Icon name="cart"/><span className="hidden lg:inline">Cart</span><span aria-live="polite" className="min-w-6 rounded-md bg-blue-50 px-1.5 py-0.5 text-center text-xs font-bold text-brand">{totalUnits}</span></a></nav>
    </div>
    <nav id="store-categories" aria-label="Product categories" className={`${menuOpen ? 'block' : 'hidden'} border-t border-slate-100 md:block`}><div className="market-shell flex gap-1 overflow-x-auto py-0.5">{[{ name: 'All categories', slug: '' }, ...categories.map((item) => ({ name: item.name, slug: item.name.toLowerCase() }))].map((item) => <a key={item.name} onClick={() => setMenuOpen(false)} href={item.slug ? `/categories/${item.slug}` : '/shop'} className="flex min-h-10 shrink-0 items-center rounded-md px-3 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-brand">{item.name}</a>)}</div></nav>
  </header>;
}
