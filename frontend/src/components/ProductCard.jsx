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
  return <article className="flex min-w-0 flex-col rounded-lg border border-slate-200 bg-white p-3 transition-shadow hover:shadow-md sm:p-4">
    <a href={detail ? `/products/${detail.slug}` : '/shop'} aria-label={`View ${device.name}`} className="product-media rounded-md">
      <Icon name={device.symbol} className="h-16 w-16 sm:h-20 sm:w-20" aria-hidden="true"/>
    </a>
    <div className="mt-3 flex flex-1 flex-col">
      <h3 className="line-clamp-2 min-h-11 text-sm font-semibold leading-5 sm:text-base">{device.name}</h3>
      <p className="mt-1 line-clamp-2 min-h-10 text-[13px] leading-5 text-slate-600">{device.detail.replaceAll('Â·', '|')}</p>
      <div className="mt-3 min-h-12">
        {offer ? <><p className="text-lg font-bold">{formatPrice(offer.price)}</p><p className="mt-0.5 text-xs text-slate-600">Sold by {offer.seller}</p></> : <><p className="text-lg font-bold">{formatPrice(device.price)}</p><p className="mt-0.5 text-xs text-slate-500">Seller offers not listed in preview</p></>}
      </div>
      {detail ? <a href={`/products/${detail.slug}`} className="mt-3 flex min-h-11 items-center justify-center rounded-md bg-brand px-3 text-sm font-semibold text-white hover:bg-blue-800">Choose options</a> : <a href="/shop" className="mt-3 flex min-h-11 items-center justify-center rounded-md border border-slate-300 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">View product</a>}
    </div>
  </article>;
}
