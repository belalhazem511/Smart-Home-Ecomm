import StoreHeader from '../components/StoreHeader.jsx';
import StoreFooter from '../components/StoreFooter.jsx';
import ProductImage from '../components/ProductImage.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Icon from '../components/Icon.jsx';
import { categories, featuredDevices } from '../data/smartAtlasCatalog.js';

const productImageFor = (category) => featuredDevices.find((product) => product.category === category)?.image || featuredDevices[0].image;

const promos = [
  { title: 'Smarter Living', subtitle: 'Premium Smart Living', text: 'Make every room work for you', image: productImageFor('Control Panels'), href: '/categories/control-panels' },
  { title: 'Achieve More', subtitle: 'Track & Automate', text: 'Simplify your daily routine', image: productImageFor('Sensors'), href: '/categories/sensors' },
  { title: 'Top Deals for You', subtitle: 'Limited Offers', text: 'Handpicked savings on smart devices', image: productImageFor('Smart Glass Panel'), href: '/shop?sort=price-asc' },
];

const trustItems = [
  { icon: 'hub', title: 'Worldwide Shipping', text: 'Fast delivery to US, UK & UAE' },
  { icon: 'security', title: 'Secure Payments', text: '100% safe & secure checkout' },
  { icon: 'switch', title: '30-Day Returns', text: 'Hassle-free returns' },
  { icon: 'user', title: 'Premium Support', text: '24/7 customer support' },
];

const ideas = [
  { title: 'Tech Setup Ideas', count: 17, icon: 'hub', href: '/categories/control-panels' },
  { title: 'Smart Glass Essentials', count: 17, icon: 'plug', href: '/categories/smart-glass-panel' },
  { title: 'Smart Living Inspiration', count: 73, icon: 'home', href: '/shop' },
  { title: 'Security Gear', count: 4, icon: 'security', href: '/categories/video-doorbell' },
  { title: 'Lighting Picks', count: 4, icon: 'light', href: '/categories/lighting' },
];

const trending = featuredDevices.slice(0, 6);

function Hero() {
  return (
    <section className="hero-gradient overflow-hidden rounded-3xl text-white">
      <div className="grid items-center gap-8 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-2 lg:px-14">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-100 ring-1 ring-inset ring-white/20">
            <span className="h-2 w-2 rounded-full bg-brand" /> New Arrival
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Discover. Shop.<br /><span className="text-brand">Upgrade.</span>
          </h1>
          <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-blue-200">Latest Tech Gadgets</p>
          <p className="mt-4 max-w-lg text-lg leading-8 text-slate-200">Explore cutting-edge gadgets that upgrade your lifestyle. Find the perfect device for a smarter home.</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a href="/shop" className="button-primary min-h-12 px-7 text-base">Explore products</a>
            <a href="#categories" className="inline-flex min-h-12 items-center px-4 font-semibold text-white hover:text-blue-200">Browse categories <span aria-hidden="true" className="ml-2">→</span></a>
          </div>
        </div>
        <div className="relative">
          <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/20">
            <ProductImage src="/assets/campaign/smart-home-living-room.webp" alt="SmartAtlas devices in a modern living room" className="h-64 w-full sm:h-80 lg:h-96" imageClassName="h-full w-full object-cover" />
          </div>
          <div className="absolute -bottom-4 -left-4 hidden rounded-xl bg-white px-4 py-3 text-ink shadow-lg sm:block">
            <p className="text-xs text-slate-500">Fast Shipping</p>
            <p className="text-sm font-bold">Smart Devices</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PromoStrip() {
  return (
    <section className="mt-6 grid gap-4 md:grid-cols-3">
      {promos.map((promo) => (
        <a key={promo.title} href={promo.href} className="promo-card flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-blue-50">
            <ProductImage src={promo.image} alt={promo.title} className="h-full w-full" imageClassName="h-full w-full object-contain p-2" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">{promo.subtitle}</p>
            <p className="mt-1 text-lg font-bold text-ink">{promo.title}</p>
            <p className="mt-0.5 text-sm text-slate-600">{promo.text}</p>
          </div>
        </a>
      ))}
    </section>
  );
}

function CategoryGrid() {
  return (
    <section id="categories" className="mt-12 scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h2 className="text-2xl font-bold tracking-tight md:text-3xl">Shop by Category</h2><p className="mt-1 text-slate-600">Find the right device for every room</p></div>
        <a href="/shop" className="font-semibold text-brand hover:underline">View all</a>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => (
          <a key={category.name} href={`/categories/${category.slug || category.name.toLowerCase()}`} className="promo-card overflow-hidden rounded-2xl border border-slate-200 bg-white text-center">
            <ProductImage src={category.image} alt={category.imageAlt} className="category-image" imageClassName="h-full w-full object-contain p-4" />
            <span className="flex min-h-12 items-center justify-center border-t border-slate-100 px-2 text-sm font-semibold text-ink">{category.name}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function TrendingProducts() {
  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h2 className="text-2xl font-bold tracking-tight md:text-3xl">Trending Products</h2><p className="mt-1 text-slate-600">Popular picks from our smart-home catalog</p></div>
        <a href="/shop" className="font-semibold text-brand hover:underline">View all</a>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {trending.map((device) => <ProductCard key={device.id} device={device} compact />)}
      </div>
    </section>
  );
}

function TrustBar() {
  return (
    <section className="mt-12 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-2 lg:grid-cols-4">
      {trustItems.map((item) => (
        <div key={item.title} className="trust-item">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-light text-brand"><Icon name={item.icon} className="h-5 w-5" /></span>
          <div><p className="text-sm font-semibold text-ink">{item.title}</p><p className="text-xs text-slate-500">{item.text}</p></div>
        </div>
      ))}
    </section>
  );
}

function IdeasSection() {
  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h2 className="text-2xl font-bold tracking-tight md:text-3xl">Ideas for Your Next Upgrade</h2><p className="mt-1 text-slate-600">Get inspired for every corner of your home</p></div>
        <a href="/shop" className="font-semibold text-brand hover:underline">See more</a>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {ideas.map((idea) => (
          <a key={idea.title} href={idea.href} className="idea-card rounded-2xl border border-slate-200 bg-white p-5 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-light text-brand"><Icon name={idea.icon} className="h-7 w-7" /></span>
            <h3 className="mt-4 text-sm font-bold text-ink">{idea.title}</h3>
            <p className="mt-1 text-xs text-slate-500">{idea.count} ideas</p>
          </a>
        ))}
      </div>
    </section>
  );
}

function Newsletter() {
  return (
    <section className="newsletter-gradient mt-12 overflow-hidden rounded-3xl px-6 py-10 text-white sm:px-10 sm:py-12">
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-200">Newsletter</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Exclusive Deals<br />for You!</h2>
          <p className="mt-3 max-w-lg text-slate-200">Save more on top-rated smart gadgets handpicked just for you. Get our latest deals in your inbox.</p>
        </div>
        <form className="flex w-full flex-col gap-3 sm:flex-row" onSubmit={(event) => event.preventDefault()}>
          <label className="sr-only" htmlFor="newsletter-email">Email address</label>
          <input id="newsletter-email" type="email" required placeholder="Enter your email address" className="min-h-12 flex-1 rounded-xl border-0 bg-white px-4 text-sm text-ink" />
          <button type="submit" className="button-primary min-h-12 rounded-xl bg-brand px-7 font-semibold hover:bg-brand-hover">Subscribe</button>
        </form>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div id="home" className="min-h-screen">
      <StoreHeader />
      <main className="market-shell pb-4 pt-5 sm:pt-6">
        <Hero />
        <PromoStrip />
        <CategoryGrid />
        <TrendingProducts />
        <TrustBar />
        <IdeasSection />
        <Newsletter />
      </main>
      <StoreFooter />
    </div>
  );
}
