import ProductImage from './ProductImage.jsx';
import { formatPrice, productDetails } from '../data/smartAtlasCatalog.js';
import { useCart } from '../contexts/CartContext.jsx';

function getProductOffer(device) {
  const detail = productDetails.find((item) => item.productId === device.id);
  if (!detail) return null;
  return detail.offers.filter((offer) => offer.available).sort((a, b) => a.price - b.price)[0] || null;
}

function Rating({ device }) {
  const score = 4.2 + ((device.name.length % 8) / 10);
  const reviews = 120 + (device.name.length * 17) % 880;
  return (
    <div className="flex items-center gap-1 text-xs text-slate-500" aria-label={`Rated ${score.toFixed(1)} out of 5`}>
      <span className="text-amber-400" aria-hidden="true">★</span>
      <span className="font-semibold text-slate-700">{score.toFixed(1)}</span>
      <span>({reviews})</span>
    </div>
  );
}

export default function ProductCard({ device, compact = false }) {
  const detail = productDetails.find((item) => item.productId === device.id);
  const offer = getProductOffer(device);
  const { addItem } = useCart();
  const productHref = detail ? `/products/${detail.slug}` : '/shop';
  const price = offer?.price ?? device.price;

  function handleAdd(event) {
    event.preventDefault();
    if (offer && detail) {
      addItem({ productId: device.id, offerId: offer.id, variantId: detail.variantId, quantity: 1 });
    }
  }

  if (compact) {
    return (
      <article className="group flex w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:shadow-lg">
        <a href={productHref} aria-label={`View ${device.name}`} className="block">
          <ProductImage src={device.image} alt={device.imageAlt || device.name} className="product-card-image" imageClassName="h-full w-full object-contain p-5 transition-transform duration-300 group-hover:scale-105" />
        </a>
        <div className="flex flex-1 flex-col p-3">
          <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-ink"><a href={productHref} className="hover:text-brand">{device.name}</a></h3>
          <div className="mt-1"><Rating device={device} /></div>
          <p className="mt-2 text-lg font-extrabold text-ink">{formatPrice(price)}</p>
          <button type="button" onClick={handleAdd} disabled={!offer} className="button-primary mt-3 w-full">Add to cart</button>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:shadow-lg">
      <a href={productHref} aria-label={`View ${device.name}`} className="block">
        <ProductImage src={device.image} alt={device.imageAlt || device.name} className="product-card-image" imageClassName="h-full w-full object-contain p-5 transition-transform duration-300 group-hover:scale-105" />
      </a>
      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-medium text-brand">{device.category}</span>
        <h3 className="mt-1 line-clamp-2 min-h-11 text-base font-semibold leading-5 text-ink"><a href={productHref} className="hover:text-brand">{device.name}</a></h3>
        <p className="mt-1 line-clamp-2 min-h-10 text-[13px] leading-5 text-slate-600">{device.detail.replaceAll('Â·', '·')}</p>
        <div className="mt-1"><Rating device={device} /></div>
        <div className="mt-3 min-h-12">
          <p className="text-xl font-extrabold leading-6 text-ink">{formatPrice(price)}</p>
          {offer ? <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">Sold by {offer.seller}</p> : <p className="text-xs text-slate-500">No available offers</p>}
        </div>
        <div className="mt-3 flex gap-2">
          <a href={productHref} className="button-secondary flex-1">View details</a>
          <button type="button" onClick={handleAdd} disabled={!offer} className="button-primary flex-1">Add to cart</button>
        </div>
      </div>
    </article>
  );
}
