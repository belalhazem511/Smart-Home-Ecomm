import { useState } from 'react';
import Icon from './Icon.jsx';
import { categories } from '../data/smartAtlasCatalog.js';
import { useCart } from '../contexts/CartContext.jsx';

const primaryNav = [
  { label: 'Home', href: '/' },
  { label: 'Categories', href: '/#categories' },
  { label: 'New arrivals', href: '/shop?sort=price-desc' },
  { label: 'Shop', href: '/shop' },
];

export default function StoreHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalUnits } = useCart();
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="border-b border-slate-100 bg-brand-light"><div className="market-shell flex min-h-7 items-center justify-between gap-3 text-xs text-slate-600"><span aria-describedby="demo-data-details">Demo environment · Fictional data</span><span id="demo-data-details" className="sr-only">Product images, specifications, sellers, and transactions are illustrative demo records.</span><span className="hidden sm:inline">Egypt · EGP</span></div></div>
      <div className="market-shell flex min-h-16 items-center gap-4 py-2">
        <button
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="store-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="grid min-h-11 min-w-11 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-700 lg:hidden"
        >
          <Icon name={menuOpen ? 'close' : 'menu'} />
        </button>

        <a href="/" className="flex shrink-0 items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white shadow-md shadow-blue-200">
            <Icon name="hub" className="h-5 w-5" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-ink">Smart<span className="text-brand">Atlas</span></span>
        </a>

        <form action="/search" method="get" role="search" className="hidden min-w-0 flex-1 md:block">
          <label className="sr-only" htmlFor="search-products">Search products</label>
          <div className="mx-auto flex h-11 max-w-xl items-center overflow-hidden rounded-full border border-slate-300 bg-white transition focus-within:border-brand focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
            <Icon name="search" className="ml-4 h-5 w-5 shrink-0 text-slate-400" />
            <input id="search-products" name="q" className="market-search-input min-w-0 flex-1 bg-transparent text-sm" placeholder="Search for tech gadgets, ideas and more" />
            <button type="submit" className="mr-1 h-9 shrink-0 rounded-full bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-hover">Search</button>
          </div>
        </form>

        <nav aria-label="Primary" className="ml-auto hidden items-center gap-1 lg:flex">
          {primaryNav.map((item) => (
            <a key={item.label} href={item.href} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-brand">{item.label}</a>
          ))}
        </nav>

        <nav aria-label="Account and cart" className="flex shrink-0 items-center gap-1">
          <a href="/sign-in" aria-label="Sign in to your account" className="grid min-h-11 min-w-11 place-items-center rounded-lg text-slate-700 hover:bg-blue-50 hover:text-brand"><Icon name="user" /></a>
          <a href="/cart" aria-label={`Cart, ${totalUnits} items`} className="relative grid min-h-11 min-w-11 place-items-center rounded-lg text-slate-700 hover:bg-blue-50 hover:text-brand">
            <Icon name="cart" />
            {totalUnits > 0 && <span aria-live="polite" className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-bold text-white">{totalUnits}</span>}
          </a>
        </nav>
      </div>

      <form action="/search" method="get" role="search" className="border-t border-slate-100 px-4 py-2 md:hidden">
        <label className="sr-only" htmlFor="search-products-mobile">Search products</label>
        <div className="flex h-10 items-center overflow-hidden rounded-full border border-slate-300 bg-white">
          <Icon name="search" className="ml-3 h-4 w-4 shrink-0 text-slate-400" />
          <input id="search-products-mobile" name="q" className="market-search-input min-w-0 flex-1 bg-transparent text-sm" placeholder="Search for tech gadgets, ideas and more" />
          <button type="submit" aria-label="Search" className="grid h-10 w-11 shrink-0 place-items-center bg-brand text-white"><Icon name="search" className="h-4 w-4" /></button>
        </div>
      </form>

      <nav id="store-navigation" aria-label="Product categories" className={`${menuOpen ? 'block' : 'hidden'} border-t border-slate-100 lg:block`}>
        <div className="market-shell flex gap-1 overflow-x-auto py-1.5">
          <a href="/shop" onClick={() => setMenuOpen(false)} className="flex min-h-9 shrink-0 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-hover">All categories</a>
          {categories.map((category) => (
            <a key={category.name} onClick={() => setMenuOpen(false)} href={`/categories/${category.slug || category.name.toLowerCase()}`} className="flex min-h-9 shrink-0 items-center rounded-lg px-4 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-brand">{category.name}</a>
          ))}
          <a href="/seller" onClick={() => setMenuOpen(false)} className="flex min-h-9 shrink-0 items-center rounded-lg px-4 text-sm font-semibold text-brand hover:bg-blue-50">Sell with us</a>
        </div>
      </nav>
    </header>
  );
}
