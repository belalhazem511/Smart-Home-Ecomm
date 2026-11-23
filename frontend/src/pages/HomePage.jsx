import StoreHeader from '../components/StoreHeader.jsx';
import StoreFooter from '../components/StoreFooter.jsx';
import ProductImage from '../components/ProductImage.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { categories, featuredDevices, productDetails } from '../data/homeContent.js';

const promotedProducts = featuredDevices.filter((device) => productDetails.some((detail) => detail.productId === device.id));

function CategoryLinks() {
  return (
    <section id="categories" className="mt-8">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-slate-600">Find what fits your home</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-[26px]">Shop by category</h2>
        </div>
        <a href="/shop" className="button-quiet">Shop all</a>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => (
          <a
            href={`/categories/${category.name.toLowerCase()}`}
            key={category.name}
            className="group overflow-hidden rounded-lg border border-slate-200 bg-white transition-colors hover:border-slate-300"
          >
            <ProductImage
              src={category.image}
              alt={category.imageAlt}
              className="category-image"
              imageClassName="h-full w-full object-contain p-4 transition-transform duration-200 group-hover:scale-105"
            />
            <span className="flex min-h-11 items-center justify-center border-t border-slate-100 px-2 text-sm font-semibold">
              {category.name}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

function HomeHero() {
  return (
    <section className="home-hero overflow-hidden rounded-xl bg-slate-950">
      <div className="home-hero-copy">
        <p className="text-xs font-bold uppercase tracking-[.14em] text-blue-200">Smart home essentials</p>
        <h1 className="mt-3 max-w-xl text-3xl font-bold leading-tight text-white sm:text-4xl">
          A smarter home.<br/>Made simple.
        </h1>
        <p className="mt-3 max-w-md text-base leading-6 text-slate-200">
          Find connected devices that fit your rooms, routines and setup.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
          <a href="/shop" className="button-primary min-h-11">Shop smart home</a>
          <a href="#categories" className="inline-flex min-h-11 items-center text-sm font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">
            Explore categories
          </a>
        </div>
      </div>
      <ProductImage
        src="/assets/campaign/smart-home-living-room.webp"
        alt="Contemporary living room with connected smart-home devices"
        className="home-hero-image"
        imageClassName="h-full w-full object-cover"
      />
    </section>
  );
}

function FeaturedDevices() {
  return (
    <section id="featured" className="mt-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-600">Considered choices for everyday comfort</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-[26px]">Featured devices</h2>
        </div>
        <a href="/shop" className="button-quiet">View all products</a>
      </div>
      <div className="mt-4 grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {promotedProducts.map((device) => <ProductCard key={device.id} device={device}/>) }
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <StoreHeader/>
      <main className="market-shell py-4 sm:py-6">
        <HomeHero/>
        <CategoryLinks/>
        <FeaturedDevices/>
        <section id="help" className="mt-8 rounded-lg border border-slate-200 bg-slate-50 px-5 py-4">
          <h2 className="text-base font-semibold">Check product requirements before buying</h2>
          <p className="mt-1 text-sm text-slate-600">
            Review the protocol, hub and installation details on each product page. Compatibility is listed as unknown when fixture information is unavailable.
          </p>
        </section>
      </main>
      <StoreFooter/>
    </div>
  );
}
