import { useState } from 'react';
import StoreHeader from '../components/StoreHeader.jsx';
import StoreFooter from '../components/StoreFooter.jsx';
import ProductImage from '../components/ProductImage.jsx';
import Icon from '../components/Icon.jsx';
import { categories, featuredDevices, formatPrice, productDetails } from '../data/smartAtlasCatalog.js';
import { changeVariant, selectOffer } from '../lib/productSelection.js';
import { useCart } from '../contexts/CartContext.jsx';

function ProductUnavailable() {
  return (
    <main className="market-shell py-16">
      <section className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-light text-brand"><Icon name="info" className="h-7 w-7" /></span>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-ink">Product details unavailable</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">This product does not have a detail page in the current catalog.</p>
        <a href="/shop" className="button-primary mt-5">Browse products</a>
      </section>
    </main>
  );
}

function ProductGallery({ productName, variant }) {
  const images = variant?.images || (variant?.image ? [{ id: 'front', src: variant.image, alt: variant.imageAlt }] : []);
  const [selectedImageId, setSelectedImageId] = useState('front');
  const selectedImage = images.find((image) => image.id === selectedImageId) || images[0];

  return (
    <section aria-label={`${productName} product gallery`} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="product-media product-gallery-frame overflow-hidden rounded-2xl border border-slate-200">
        {selectedImage ? (
          <ProductImage
            key={`${variant.id}-${selectedImage.id}-${selectedImage.src}`}
            src={selectedImage.src}
            alt={selectedImage.alt}
            className="h-full w-full"
            imageClassName="h-full w-full object-contain p-8 sm:p-12"
          />
        ) : (
          <div className="h-full w-full" role="img" aria-label={`${productName} image unavailable`}/>
        )}
      </div>
      {variant?.imageNote && <p className="mt-2 text-xs text-slate-500">{variant.imageNote}</p>}
      {images.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-3" aria-label="Product image thumbnails">
          {images.map((image) => (
            <button
              key={image.id}
              type="button"
              aria-label={`View ${image.alt}`}
              aria-pressed={selectedImage?.id === image.id}
              onClick={() => setSelectedImageId(image.id)}
              className={`product-media h-20 w-20 overflow-hidden rounded-xl border bg-white p-1 transition-colors ${selectedImage?.id === image.id ? 'border-brand ring-1 ring-brand' : 'border-slate-200 hover:border-slate-400'}`}
            >
              <ProductImage
                key={image.src}
                src={image.src}
                alt=""
                className="h-full w-full"
                imageClassName="h-full w-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function SellerOffer({ offer, selected, onSelect }) {
  return (
    <label className={`block cursor-pointer rounded-2xl border p-4 transition-colors ${selected ? 'border-brand bg-brand-light ring-1 ring-brand' : 'border-slate-200 bg-white hover:border-slate-300'} ${offer.available ? '' : 'cursor-not-allowed bg-brand-light/50 text-slate-500'}`}>
      <span className="flex items-start gap-3">
        <input
          type="radio"
          name="seller-offer"
          disabled={!offer.available}
          checked={selected}
          onChange={onSelect}
          className="mt-1 accent-brand"
        />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <span className="font-bold text-ink">{offer.seller}</span>
            <span className="font-extrabold tabular-nums text-brand">{offer.available ? formatPrice(offer.price) : 'Unavailable'}</span>
          </span>
          <span className="mt-1 block text-sm text-slate-600">
            {offer.available ? offer.warranty : 'This offer is currently unavailable.'}
          </span>
        </span>
      </span>
    </label>
  );
}

function PriceSummary({ selectedOffer, availableOffers }) {
  if (selectedOffer) {
    return (
      <div className="mt-6 rounded-2xl bg-brand-light p-5">
        <p className="text-sm font-semibold text-slate-600">Selected offer price</p>
        <p className="mt-1 text-3xl font-extrabold tracking-tight text-brand">{formatPrice(selectedOffer.price)}</p>
      </div>
    );
  }

  const lowestOffer = availableOffers.reduce(
    (lowest, offer) => offer.price < lowest.price ? offer : lowest,
    availableOffers[0],
  );

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-sm font-semibold text-slate-600">Offers from</p>
      {lowestOffer ? (
        <p className="mt-1 text-3xl font-extrabold tracking-tight text-brand">{formatPrice(lowestOffer.price)}</p>
      ) : (
        <p className="mt-1 text-lg font-bold text-ink">No available offers</p>
      )}
    </div>
  );
}

function QuantityControl({ quantity, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-bold text-ink">Quantity</span>
      <div className="flex h-11 items-center overflow-hidden rounded-xl border border-slate-300 bg-white">
        <button
          type="button"
          aria-label="Decrease quantity"
          disabled={quantity <= 1}
          onClick={() => onChange(quantity - 1)}
          className="h-full w-11 text-lg hover:bg-brand-light hover:text-brand disabled:text-slate-300"
        >−</button>
        <output aria-live="polite" className="min-w-10 px-2 text-center font-bold tabular-nums text-ink">{quantity}</output>
        <button
          type="button"
          aria-label="Increase quantity"
          disabled={quantity >= 99}
          onClick={() => onChange(quantity + 1)}
          className="h-full w-11 text-lg hover:bg-brand-light hover:text-brand disabled:text-slate-300"
        >+</button>
      </div>
    </div>
  );
}

function ProductInformation({ product, detail, variant, selection, currentOffer, currentOffers, onChooseVariant, onChooseOffer, quantity, onQuantityChange, onAddToCart, added }) {
  const availableOffers = currentOffers.filter((offer) => offer.available);

  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <p className="text-xs font-bold uppercase tracking-widest text-brand">SmartAtlas · {product.category}</p>
      <h1 className="mt-2 text-[28px] font-extrabold leading-tight tracking-tight text-ink sm:text-[32px]">{product.name}</h1>
      <p className="mt-3 text-base leading-7 text-slate-600">{product.detail.replaceAll('Â·', '·')}</p>

      <PriceSummary selectedOffer={currentOffer} availableOffers={availableOffers}/>

      <fieldset className="mt-6">
        <legend className="text-base font-bold text-ink">Choose a variant</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {detail.variants.map((item) => (
            <label
              key={item.id}
              className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border px-3 text-sm transition-colors ${selection.variantId === item.id ? 'border-brand bg-brand-light font-bold text-brand ring-1 ring-brand' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}
            >
              <input
                type="radio"
                name="product-variant"
                checked={selection.variantId === item.id}
                onChange={() => onChooseVariant(item.id)}
                className="accent-brand"
              />
              {item.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="text-base font-bold text-ink">Seller offers</legend>
        <p className="mt-1 text-sm text-slate-600">Choose an available seller for this variant.</p>
        <div className="mt-3 space-y-2">
          {currentOffers.map((offer) => (
            <SellerOffer
              key={offer.id}
              offer={offer}
              selected={selection.offerId === offer.id}
              onSelect={() => onChooseOffer(offer)}
            />
          ))}
          {currentOffers.length === 0 && <p className="text-sm text-slate-600">No seller offers are listed for this variant.</p>}
        </div>
        {currentOffer && (
          <p className="mt-3 text-sm text-slate-700">
            Warranty from <span className="font-bold text-brand">{currentOffer.seller}</span>: {currentOffer.warranty}
          </p>
        )}
      </fieldset>

      <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-5">
        <QuantityControl quantity={quantity} onChange={onQuantityChange}/>
        <button
          type="button"
          disabled={!currentOffer}
          onClick={onAddToCart}
          className="button-primary min-h-11 flex-1 px-5 font-semibold disabled:bg-slate-300 disabled:text-slate-700"
        >
          Add to cart
        </button>
      </div>
      {added && (
        <p role="status" className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">
          Added to cart. <a href="/cart" className="underline">View cart</a>
        </p>
      )}
      <p className="mt-5 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500">
        Preview only. Stock is not reserved; delivery is calculated at checkout.
      </p>
    </section>
  );
}

function ProductDetailsSections({ product, variant, selectedOffer }) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-extrabold tracking-tight text-ink">Product information</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-light text-brand"><Icon name="info" /></span>
            <h3 className="text-lg font-bold text-ink">Description</h3>
          </div>
          <p className="mt-4 max-w-prose leading-7 text-slate-700">{product.description}</p>
          {product.features?.length > 0 && <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">{product.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>}
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-light text-brand"><Icon name="switch" /></span>
            <h3 className="text-lg font-bold text-ink">Specifications</h3>
          </div>
          <ul className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-brand-light/50">
            {(variant?.specs || product.specifications || []).map((spec) => <li key={`${spec.label}-${spec.value}`} className="flex items-center justify-between gap-4 px-4 py-3 text-sm text-slate-700"><span className="text-slate-500">{spec.label}</span><span className="text-right font-semibold">{spec.value}</span></li>)}
          </ul>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-light text-brand"><Icon name="hub" /></span>
            <h3 className="text-lg font-bold text-ink">Compatibility</h3>
          </div>
          <p className="mt-4 leading-7 text-slate-700">
            Protocol: {product.connectivity}. {product.requiresHub ? 'A hub is listed as required.' : 'No hub is listed as required.'}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Compatibility with specific ecosystems and home setups is unknown. Verify requirements before purchase.
          </p>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-light text-brand"><Icon name="security" /></span>
            <h3 className="text-lg font-bold text-ink">Warranty</h3>
          </div>
          {selectedOffer ? (
            <p className="mt-4 leading-7 text-slate-700">
              {selectedOffer.seller} states: {selectedOffer.warranty}
            </p>
          ) : (
            <p className="mt-4 leading-7 text-slate-600">Warranty terms are seller-specific. Choose an available offer to view them.</p>
          )}
        </section>
      </div>
    </section>
  );
}

export default function ProductPage({ pathname }) {
  const slug = decodeURIComponent(pathname.split('/')[2]);
  const detail = productDetails.find((item) => item.slug === slug);
  const product = detail && featuredDevices.find((item) => item.id === detail.productId);
  const [selection, setSelection] = useState(() => ({ variantId: detail?.variantId || '', offerId: '' }));
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  if (!detail || !product) {
    return <div className="min-h-screen bg-canvas"><StoreHeader/><ProductUnavailable/><StoreFooter/></div>;
  }

  const variant = detail.variants.find((item) => item.id === selection.variantId);
  const currentOffer = detail.offers.find((offer) =>
    offer.id === selection.offerId && offer.variantId === selection.variantId && offer.available,
  );
  const currentOffers = detail.offers.filter((offer) => offer.variantId === selection.variantId);

  function chooseVariant(variantId) {
    setSelection((current) => changeVariant(current, variantId, detail.offers));
    setAdded(false);
  }

  function chooseOffer(offer) {
    if (!variant) return;
    setSelection((current) => selectOffer(current, variant.id, offer.id, detail.offers));
    setAdded(false);
  }

  function addToCart() {
    if (!currentOffer) return;
    addItem({
      productId: product.id,
      variantId: selection.variantId,
      offerId: currentOffer.id,
      quantity,
    });
    setAdded(true);
  }

  return (
    <div className="min-h-screen bg-canvas">
      <StoreHeader/>
      <main className="market-shell py-6">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center text-xs text-slate-500 sm:text-sm">
          <a href="/" className="rounded-lg px-1 py-1 hover:text-brand">Home</a>
          <span className="mx-1" aria-hidden="true">/</span>
          <a href={`/categories/${categories.find((item) => item.name === product.category)?.slug || product.category.toLowerCase().replace(/\s+/g, '-')}`} className="rounded-lg px-1 py-1 hover:text-brand">{product.category}</a>
          <span className="mx-1" aria-hidden="true">/</span>
          <span aria-current="page" className="px-1 py-1 font-semibold text-ink">{product.name}</span>
        </nav>

        <div className="mt-6 grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(380px,.9fr)] lg:gap-6 xl:gap-8">
          <ProductGallery productName={product.name} variant={variant}/>
          <ProductInformation
            product={product}
            detail={detail}
            variant={variant}
            selection={selection}
            currentOffer={currentOffer}
            currentOffers={currentOffers}
            onChooseVariant={chooseVariant}
            onChooseOffer={chooseOffer}
            quantity={quantity}
            onQuantityChange={setQuantity}
            onAddToCart={addToCart}
            added={added}
          />
        </div>

        <ProductDetailsSections product={product} variant={variant} selectedOffer={currentOffer}/>
      </main>
      <StoreFooter/>
    </div>
  );
}
