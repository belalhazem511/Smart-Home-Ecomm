import { useState } from 'react';
import Icon from './Icon.jsx';
import { useCart } from '../contexts/CartContext.jsx';

const links = ['All categories', 'Switches', 'Lighting', 'Sensors', 'Security', 'Curtains', 'Hubs'];

export default function StoreHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalUnits } = useCart();
  return <>
    <div className="hidden border-b border-slate-200 bg-slate-100 text-sm md:block"><div className="mx-auto flex max-w-content justify-between px-6 py-2 text-slate-700"><span>Smart devices. Clear choices.</span><div className="flex gap-6"><a href="#help">Help &amp; support</a><a href="#sellers">Sell with us</a></div></div></div>
    <header className="mx-auto max-w-content px-4 md:px-6 lg:px-8">
      <div className="flex min-h-16 items-center justify-between gap-3 border-b border-slate-200 py-2 md:min-h-[76px]">
        <button className="flex min-h-11 min-w-11 items-center justify-center md:hidden" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="category-nav" onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? 'close' : 'menu'}/></button>
        <a href="/" className="flex shrink-0 items-center gap-2 text-lg font-extrabold sm:text-xl"><Icon name="home" className="h-8 w-8 text-brand"/>SMART HOME</a>
        <form action="/search" method="get" role="search" className="hidden max-w-xl flex-1 md:flex"><label className="sr-only" htmlFor="search-desktop">Search devices, brands or protocols</label><input id="search-desktop" name="q" className="h-12 w-full rounded-lg border border-slate-400 bg-white px-4" placeholder="Search devices, brands or protocols"/></form>
        <div className="flex items-center gap-2"><button type="button" disabled aria-label="Account (available in a later release)" title="Account available in a later release" className="flex min-h-11 cursor-not-allowed items-center gap-2 px-2 text-slate-500"><Icon name="user"/><span className="hidden lg:inline">Account · Later</span></button><a href="/cart" aria-label={`Cart, ${totalUnits} items`} className="flex min-h-11 items-center gap-2 px-2 hover:text-brand"><Icon name="cart"/><span className="hidden lg:inline">Cart</span><span aria-live="polite" className="min-w-5 rounded-full bg-blue-100 px-1 text-center text-xs font-semibold text-brand">{totalUnits}</span></a></div>
      </div>
      <form action="/search" method="get" role="search" className="flex gap-2 py-2 md:hidden"><label className="sr-only" htmlFor="search-mobile">Search devices or protocols</label><input id="search-mobile" name="q" className="h-12 min-w-0 flex-1 rounded-lg border border-slate-400 bg-white px-4" placeholder="Search devices or protocols"/><span className="flex min-h-11 items-center rounded-lg border border-slate-300 px-3 text-sm">Egypt · EGP</span></form>
      <nav id="category-nav" aria-label="Device categories" className={`${menuOpen ? 'block' : 'hidden'} border-b border-slate-200 md:block`}><div className="flex gap-1 overflow-x-auto py-2 md:justify-between">{links.map((name, index) => <a key={name} onClick={() => setMenuOpen(false)} className="min-h-11 shrink-0 rounded-lg px-3 py-3 text-sm font-medium hover:bg-slate-100" href={index === 0 ? '/shop' : `/categories/${name.toLowerCase()}`}>{name}</a>)}</div></nav>
    </header>
  </>;
}
