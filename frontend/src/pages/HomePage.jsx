import StoreHeader from '../components/StoreHeader.jsx';
import StoreFooter from '../components/StoreFooter.jsx';
import Icon from '../components/Icon.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { categories, featuredDevices } from '../data/homeContent.js';

function CategoryLinks() {
  return <section id="categories" className="mt-10"><div className="flex flex-wrap items-end justify-between gap-2"><div><h2 className="text-2xl font-bold">Shop by category</h2><p className="mt-1 text-sm text-slate-600">Start with the devices you need</p></div><a href="/shop" className="min-h-11 py-2 text-sm font-semibold text-brand">Browse all</a></div><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{categories.map((category) => <a href={`/categories/${category.name.toLowerCase()}`} key={category.name} className="rounded-lg border border-slate-200 bg-white p-3 transition-shadow hover:shadow-sm sm:p-4"><div className="product-media rounded-md"><Icon name={category.icon} className="h-10 w-10 text-slate-500"/></div><h3 className="mt-3 text-sm font-semibold">{category.name}</h3><p className="mt-1 text-xs text-slate-600">{category.note}</p></a>)}</div></section>;
}

export default function HomePage() {
  return <div className="min-h-screen"><StoreHeader/><main className="market-shell py-5 sm:py-7">
    <section className="grid overflow-hidden rounded-xl border border-slate-200 bg-white md:grid-cols-[1fr_.85fr]">
      <div className="flex flex-col items-start justify-center px-5 py-8 sm:px-9 sm:py-10"><p className="text-xs font-bold uppercase tracking-wider text-brand">Smart home essentials</p><h1 className="mt-3 max-w-xl text-3xl font-bold leading-tight sm:text-4xl">Make your home work a little smarter.</h1><p className="mt-3 max-w-lg text-base leading-6 text-slate-600">Compare switches, sensors, lighting and hubs with clear product and seller information.</p><div className="mt-5 flex flex-wrap gap-3"><a href="/shop" className="inline-flex min-h-11 items-center rounded-md bg-brand px-5 text-sm font-semibold text-white hover:bg-blue-800">Shop all products</a><a href="#categories" className="inline-flex min-h-11 items-center rounded-md border border-slate-300 px-5 text-sm font-semibold">Browse categories</a></div></div>
      <div className="hero-placeholder grid min-h-48 place-items-center md:min-h-[300px]" role="img" aria-label="Decorative smart-home illustration"><Icon name="home" className="h-20 w-20 text-slate-400"/></div>
    </section>
    <CategoryLinks/>
    <section id="featured" className="mt-10"><div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-bold">Popular picks</h2><p className="mt-1 text-sm text-slate-600">Product and seller details shown when available</p></div><a href="/shop" className="min-h-11 py-2 text-sm font-semibold text-brand">See all products</a></div><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{featuredDevices.slice(0, 5).map((device) => <ProductCard key={device.id} device={device}/>)}</div></section>
    <section id="help" className="mt-10 grid gap-4 rounded-lg border border-slate-200 bg-white p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6"><div><h2 className="text-lg font-semibold">Check compatibility before you choose</h2><p className="mt-1 text-sm text-slate-600">Review each product's protocol, hub and installation requirements. Unknown compatibility stays clearly marked.</p></div><a href="/shop" className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-300 px-4 text-sm font-semibold hover:bg-slate-50">Compare devices</a></section>
  </main><StoreFooter/></div>;
}
