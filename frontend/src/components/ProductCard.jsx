import ProductImage from './ProductImage.jsx';
import { formatPrice, productDetails } from '../data/homeContent.js';

function getProductOffer(device) {
  const detail = productDetails.find((item) => item.productId === device.id);
  if (!detail) return null;
  return detail.offers.filter((offer) => offer.available).sort((a, b) => a.price - b.price)[0] || null;
}

export default function ProductCard({ device }) {
  const detail = productDetails.find((item) => item.productId === device.id);
  const offer = getProductOffer(device);
  const productHref = detail ? `/products/${detail.slug}` : '/shop';

  return (
    <article className="flex w-full min-w-0 max-w-[400px] flex-col rounded-lg border border-slate-200 bg-white p-3 transition-shadow duration-150 hover:shadow-sm sm:p-4">
      <a href={productHref} aria-label={`View ${device.name}`} className="block">
        <ProductImage
          src={device.image}
          alt={device.imageAlt || device.name}
          className="product-card-image rounded-md"
          imageClassName="h-full w-full object-contain p-4"
        />
      </a>
      <div className="mt-3 flex flex-1 flex-col">
        <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 sm:text-base">
          <a href={productHref} className="hover:text-brand">{device.name}</a>
        </h3>
        <p className="mt-1 line-clamp-1 min-h-5 text-[13px] leading-5 text-slate-600">
          {device.detail.replaceAll('Â·', '·')}
        </p>
        <div className="mt-3 min-h-12">
          {offer ? (
            <>
              <p className="text-lg font-bold leading-6">{formatPrice(offer.price)}</p>
              <p className="mt-0.5 line-clamp-1 text-[13px] text-slate-600">Sold by {offer.seller}</p>
            </>
          ) : <p className="text-lg font-bold leading-6">{formatPrice(device.price)}</p>}
        </div>
        {detail ? (
          <a href={`/products/${detail.slug}`} className="button-primary mt-3 w-full">Choose options</a>
        ) : (
          <a href="/shop" className="button-secondary mt-3 w-full">Browse catalog</a>
        )}
      </div>
    </article>
  );
}
