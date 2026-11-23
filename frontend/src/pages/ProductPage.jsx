import { useState } from 'react';
import StoreHeader from '../components/StoreHeader.jsx';
import StoreFooter from '../components/StoreFooter.jsx';
import ProductImage from '../components/ProductImage.jsx';
import { featuredDevices, formatPrice, productDetails } from '../data/homeContent.js';
import { changeVariant, selectOffer } from '../lib/productSelection.js';
import { useCart } from '../contexts/CartContext.jsx';

function ProductUnavailable() {
  return (
    <main className="market-shell py-16 text-center">
      <h1 className="text-2xl font-bold">Product details unavailable</h1>
      <p className="mt-2 text-sm text-slate-600">This product does not have a detail page in the current catalog.</p>
      <a href="/shop" className="button-primary mt-5">Browse products</a>
    </main>
  );
}

function ProductGallery({ productName, variant }) {
  const images = variant?.images || (variant?.image ? [{ id: 'front', src: variant.image, alt: variant.imageAlt }] : []);
  const [selectedImageId, setSelectedImageId] = useState('front');
  const selectedImage = images.find((image) => image.id === selectedImageId) || images[0];

  return (
    <section aria-label={`${productName} product gallery`} className="min-w-0">
      <div className="product-gallery-frame overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
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
      {images.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-3" aria-label="Product image thumbnails">
          {images.map((image) => (
            <button
              key={image.id}
              type="button"
              aria-label={`View ${image.alt}`}
              aria-pressed={selectedImage?.id === image.id}
              onClick={() => setSelectedImageId(image.id)}
              className={`h-20 w-20 overflow-hidden rounded-md border bg-white p-1 ${selectedImage?.id === image.id ? 'border-brand ring-1 ring-brand' : 'border-slate-200 hover:border-slate-400'}`}
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
    <label className={`block cursor-pointer rounded-md border p-3 transition-colors ${selected ? 'border-brand bg-blue-50 ring-1 ring-brand' : 'border-slate-300 bg-white hover:border-slate-400'} ${offer.available ? '' : 'cursor-not-allowed bg-slate-50 text-slate-500'}`}>
      <span className="flex items-start gap-3">
        <input
          type="radio"
          name="seller-offer"
          disabled={!offer.available}
          checked={selected}
          onChange={onSelect}
          className="mt-1"
        />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <span className="font-semibold">{offer.seller}</span>
            <span className="font-bold">{offer.available ? formatPrice(offer.price) : 'Unavailable'}</span>
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
      <div className="mt-5">
        <p className="text-sm text-slate-600">Selected offer price</p>
        <p className="mt-1 text-3xl font-bold tracking-tight">{formatPrice(selectedOffer.price)}</p>
      </div>
    );
  }

  const lowestOffer = availableOffers.reduce(
    (lowest, offer) => offer.price < lowest.price ? offer : lowest,
    availableOffers[0],
  );

  return (
    <div className="mt-5">
      <p className="text-sm text-slate-600">Offers from</p>
      {lowestOffer ? (
        <p className="mt-1 text-3xl font-bold tracking-tight">{formatPrice(lowestOffer.price)}</p>
      ) : (
        <p className="mt-1 text-lg font-semibold">No available offers</p>
      )}
    </div>
  );
}

function QuantityControl({ quantity, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-semibold">Quantity</span>
      <div className="flex h-11 items-center overflow-hidden rounded-md border border-slate-300 bg-white">
        <button
          type="button"
          aria-label="Decrease quantity"
          disabled={quantity <= 1}
          onClick={() => onChange(quantity - 1)}
          className="h-full w-11 text-lg hover:bg-slate-50 disabled:text-slate-300"
        >−</button>
        <output aria-live="polite" className="min-w-10 px-2 text-center font-semibold">{quantity}</output>
        <button
          type="button"
          aria-label="Increase quantity"
          disabled={quantity >= 99}
          onClick={() => onChange(quantity + 1)}
          className="h-full w-11 text-lg hover:bg-slate-50 disabled:text-slate-300"
        >+</button>
      </div>
    </div>
  );
}

function ProductInformation({ product, detail, variant, selection, currentOffer, currentOffers, onChooseVariant, onChooseOffer, quantity, onQuantityChange, onAddToCart, added }) {
  const availableOffers = currentOffers.filter((offer) => offer.available);

  return (
    <section className="min-w-0">
      <p className="text-sm font-semibold text-slate-600">Smart home · {product.category}</p>
      <h1 className="mt-2 text-[28px] font-bold leading-tight tracking-tight sm:text-[32px]">{product.name}</h1>
      <p className="mt-3 text-base leading-6 text-slate-600">{product.detail.replaceAll('Â·', '·')}</p>

      <PriceSummary selectedOffer={currentOffer} availableOffers={availableOffers}/>

      <fieldset className="mt-6">
        <legend className="text-base font-semibold">Choose a variant</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {detail.variants.map((item) => (
            <label
              key={item.id}
              className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm ${selection.variantId === item.id ? 'border-brand bg-blue-50 font-semibold' : 'border-slate-300 bg-white hover:border-slate-400'}`}
            >
              <input
                type="radio"
                name="product-variant"
                checked={selection.variantId === item.id}
                onChange={() => onChooseVariant(item.id)}
              />
              {item.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="text-base font-semibold">Seller offers</legend>
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
            Warranty from <span className="font-semibold">{currentOffer.seller}</span>: {currentOffer.warranty}
          </p>
        )}
      </fieldset>

      <div className="mt-6 flex flex-wrap items-center gap-4">
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
        <p role="status" className="mt-3 text-sm font-medium text-green-800">
          Added to cart. <a href="/cart" className="underline">View cart</a>
        </p>
      )}
      <p className="mt-4 border-t border-slate-200 pt-3 text-xs leading-5 text-slate-500">
        Preview only. Stock is not reserved; delivery is calculated at checkout.
      </p>
    </section>
  );
}

function ProductDetailsSections({ product, variant, selectedOffer }) {
  return (
    <section className="mt-12 border-t border-slate-200 pt-8">
      <h2 className="text-2xl font-bold">Product information</h2>
      <div className="mt-6 grid gap-x-12 gap-y-8 md:grid-cols-2">
        <section>
          <h3 className="text-lg font-semibold">Description</h3>
          <p className="mt-2 max-w-prose leading-7 text-slate-700">{product.description}</p>
        </section>
        <section>
          <h3 className="text-lg font-semibold">Specifications</h3>
          <ul className="mt-2 divide-y divide-slate-100 rounded-md border border-slate-200 bg-white">
            {variant?.specs.map((spec) => <li key={spec} className="px-4 py-3 text-sm text-slate-700">{spec}</li>)}
          </ul>
        </section>
        <section>
          <h3 className="text-lg font-semibold">Compatibility</h3>
          <p className="mt-2 leading-6 text-slate-700">
            Protocol: {product.connectivity}. {product.requiresHub ? 'A hub is listed as required.' : 'No hub is listed as required.'}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Compatibility with specific ecosystems and home setups is unknown. Verify requirements before purchase.
          </p>
        </section>
        <section>
          <h3 className="text-lg font-semibold">Warranty</h3>
          {selectedOffer ? (
            <p className="mt-2 leading-6 text-slate-700">
              {selectedOffer.seller} states: {selectedOffer.warranty}
            </p>
          ) : (
            <p className="mt-2 leading-6 text-slate-600">Warranty terms are seller-specific. Choose an available offer to view them.</p>
          )}
        </section>
      </div>
    </section>
  );
}

export default function ProductPage({ pathname }) {
  const slug = pathname.split('/')[2];
  const detail = productDetails.find((item) => item.slug === slug);
  const product = detail && featuredDevices.find((item) => item.id === detail.productId);
  const [selection, setSelection] = useState(() => ({ variantId: detail?.variantId || '', offerId: '' }));
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  if (!detail || !product) {
    return <div className="min-h-screen bg-white"><StoreHeader/><ProductUnavailable/><StoreFooter/></div>;
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
    <div className="min-h-screen bg-white">
      <StoreHeader/>
      <main className="market-shell py-5 sm:py-7">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
          <a href="/" className="hover:text-brand">Home</a>
          <span className="mx-2" aria-hidden="true">/</span>
          <a href={`/categories/${product.category.toLowerCase()}`} className="hover:text-brand">{product.category}</a>
          <span className="mx-2" aria-hidden="true">/</span>
          <span aria-current="page" className="text-slate-700">{product.name}</span>
        </nav>

        <div className="mt-5 grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(380px,.9fr)] lg:gap-10 xl:gap-12">
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
