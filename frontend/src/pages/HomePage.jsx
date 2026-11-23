import StoreHeader from '../components/StoreHeader.jsx';
import StoreFooter from '../components/StoreFooter.jsx';
import Icon from '../components/Icon.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { categories, featuredDevices, productDetails } from '../data/homeContent.js';

const promotedProducts = featuredDevices.filter((device) => productDetails.some((detail) => detail.productId === device.id));

function CategoryLinks() {
  return <section id="categories" className="mt-6"><div className="flex flex-wrap items-end justify-between gap-2"><div><h2 className="text-xl font-bold sm:text-2xl">Shop by category</h2><p className="mt-1 text-sm text-slate-600">Browse smart-home devices</p></div><a href="/shop" className="button-quiet">Shop all</a></div><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">{categories.map((category) => <a href={`/categories/${category.name.toLowerCase()}`} key={category.name} className="flex min-w-0 items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 transition-colors hover:border-slate-300 hover:bg-slate-50"><div className="product-media h-12 w-12 shrink-0 rounded-md"><Icon name={category.icon} className="h-6 w-6 text-slate-600"/></div><span className="min-w-0 text-sm font-semibold">{category.name}</span></a>)}</div></section>;
}

export default function HomePage() {
  return <div className="min-h-screen"><StoreHeader/><main className="market-shell py-4 sm:py-6">
    <section className="flex flex-wrap items-center justify-between gap-5 rounded-xl border border-slate-200 bg-white px-5 py-6 sm:px-8 sm:py-7">
      <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-wider text-brand">Smart home essentials</p><h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">Make your home work a little smarter.</h1><p className="mt-2 max-w-2xl text-base leading-6 text-slate-600">Compare connected devices with clear specifications and seller terms.</p></div><div className="flex shrink-0 flex-wrap gap-2"><a href="/shop" className="button-primary">Shop products</a><a href="#categories" className="button-secondary">Browse categories</a></div>
    </section>
    <CategoryLinks/>
    <section id="featured" className="mt-7"><div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-xl font-bold sm:text-2xl">Featured devices</h2><p className="mt-1 text-sm text-slate-600">Products with supported detail and seller offer data</p></div><a href="/shop" className="button-quiet">View all products</a></div><div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{promotedProducts.map((device) => <ProductCard key={device.id} device={device}/>)}</div></section>
    <section id="help" className="mt-7 rounded-lg border border-slate-200 bg-white px-5 py-4"><h2 className="text-base font-semibold">Check product requirements before buying</h2><p className="mt-1 text-sm text-slate-600">Review the protocol, hub and installation details on each product page. Compatibility is listed as unknown when fixture information is unavailable.</p></section>
  </main><StoreFooter/></div>;
}
