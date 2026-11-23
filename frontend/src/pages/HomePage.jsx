import StoreHeader from '../components/StoreHeader.jsx';
import StoreFooter from '../components/StoreFooter.jsx';
import ProductImage from '../components/ProductImage.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { categories, featuredDevices, productDetails } from '../data/homeContent.js';

const promotedProducts = featuredDevices.filter((device) =>
  productDetails.some((detail) => detail.productId === device.id),
).slice(0, 3);

function HomeHero() {
  return (
    <section className="home-hero overflow-hidden rounded-2xl bg-slate-950 text-white">
      <div className="home-hero-copy">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">
          Thoughtful technology, made simple
        </p>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight sm:text-5xl">
          A smarter home.<br/>Made simple.
        </h1>
        <p className="mt-4 text-lg text-slate-200">Find the right devices for every room.</p>
        <a href="/shop" className="button-primary mt-6 min-h-12 px-6 font-semibold">
          Shop smart home
        </a>
        <a href="#categories" className="mt-3 inline-flex min-h-11 items-center py-2 font-medium text-white">
          Explore categories <span aria-hidden="true" className="ml-2">→</span>
        </a>
      </div>
      <ProductImage
        src="/assets/campaign/smart-home-living-room.webp"
        alt="Smart-home living room"
        className="home-hero-image"
        imageClassName="h-full w-full object-cover"
      />
    </section>
  );
}

function CategoryGrid() {
  return (
    <section id="categories" className="mt-9 scroll-mt-6 md:mt-12">
      <h2 className="text-2xl font-bold md:text-3xl">Build your smart home</h2>
      <p className="mt-1 text-slate-600">Browse by device</p>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
        {categories.map((category) => (
          <a
            href={`/categories/${category.name.toLowerCase()}`}
            key={category.name}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white text-center transition-shadow hover:shadow-md"
          >
            <ProductImage
              src={category.image}
              alt={category.imageAlt}
              className="category-image"
              imageClassName="h-full w-full object-contain p-3"
            />
            <span className="flex min-h-11 items-center justify-center border-t border-slate-100 px-2 font-semibold">
              {category.name}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

function FeaturedDevices() {
  return (
    <section id="featured" className="mt-10 scroll-mt-6 md:mt-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-2xl font-bold md:text-3xl">Featured devices</h2>
        <a href="/shop" className="min-h-11 py-2 font-medium text-brand">View all products</a>
      </div>
      <div className="mx-auto mt-5 grid max-w-5xl grid-cols-1 justify-items-center gap-3 min-[360px]:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {promotedProducts.map((device) => <ProductCard key={device.id} device={device}/>) }
      </div>
    </section>
  );
}

function CompatibilityPanel() {
  return (
    <section className="mt-10 grid gap-5 rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:p-8 md:mt-14 md:grid-cols-[1fr_auto] md:items-center">
      <div>
        <h2 className="text-2xl font-bold">Not sure what works together?</h2>
        <p className="mt-2 text-slate-700">Check hub, protocol and wiring requirements before you buy.</p>
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Protocols available in the product fixtures">
          <li className="rounded-full border border-slate-300 bg-white px-4 py-2">Wi-Fi</li>
          <li className="rounded-full border border-slate-300 bg-white px-4 py-2">Zigbee</li>
          <li className="rounded-full border border-slate-300 bg-white px-4 py-2">Thread</li>
        </ul>
      </div>
      <a href="/shop" className="button-primary min-h-11 px-5 font-semibold">Browse devices</a>
    </section>
  );
}

export default function HomePage() {
  return (
    <div id="home" className="min-h-screen">
      <StoreHeader/>
      <main className="market-shell pb-10 pt-4 sm:pt-6">
        <HomeHero/>
        <CategoryGrid/>
        <FeaturedDevices/>
        <CompatibilityPanel/>
      </main>
      <StoreFooter/>
    </div>
  );
}
