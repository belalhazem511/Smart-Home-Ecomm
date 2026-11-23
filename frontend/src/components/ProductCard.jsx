import Icon from './Icon.jsx';
import { formatPrice, productDetails } from '../data/homeContent.js';

function getProductOffer(device) {
  const detail = productDetails.find((item) => item.productId === device.id);
  if (!detail) return null;
  return detail.offers.filter((offer) => offer.available).sort((a, b) => a.price - b.price)[0] || null;
}

export default function ProductCard({ device }) {
  const detail = productDetails.find((item) => item.productId === device.id);
  const offer = getProductOffer(device);
  return <article className="flex min-w-0 flex-col rounded-lg border border-slate-200 bg-white p-3 transition-shadow duration-150 hover:shadow-sm sm:p-4">
    <a href={detail ? `/products/${detail.slug}` : '/shop'} aria-label={`View ${device.name}`} className="product-media h-28 rounded-md sm:h-40">
      <Icon name={device.symbol} className="h-12 w-12 sm:h-16 sm:w-16" aria-hidden="true"/>
    </a>
    <div className="mt-3 flex flex-1 flex-col">
      <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 sm:text-base">{device.name}</h3>
      <p className="mt-1 line-clamp-2 min-h-10 text-[13px] leading-5 text-slate-600">{device.detail.replaceAll('Â·', '·')}</p>
      <div className="mt-2 min-h-12">
        {offer ? <><p className="text-lg font-bold leading-6">{formatPrice(offer.price)}</p><p className="mt-0.5 text-[13px] text-slate-600">Sold by {offer.seller}</p></> : <p className="text-lg font-bold leading-6">{formatPrice(device.price)}</p>}
      </div>
      {detail ? <a href={`/products/${detail.slug}`} className="button-primary mt-3 w-full">Choose options</a> : <a href="/shop" className="button-secondary mt-3 w-full">Browse catalog</a>}
    </div>
  </article>;
}
