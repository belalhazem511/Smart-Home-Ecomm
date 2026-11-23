import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import StoreHeader from '../components/StoreHeader.jsx';
import StoreFooter from '../components/StoreFooter.jsx';
import { featuredDevices, formatPrice, productDetails } from '../data/homeContent.js';
import { changeVariant, selectOffer } from '../lib/productSelection.js';
import { useCart } from '../contexts/CartContext.jsx';

function ProductUnavailable() {
  return <div className="market-shell py-16 text-center"><h1 className="text-2xl font-bold">Product details unavailable</h1><p className="mt-2 text-sm text-slate-600">This product has no detail fixture in the current preview.</p><a href="/shop" className="mt-5 inline-flex min-h-11 items-center rounded-md bg-brand px-5 text-sm font-semibold text-white">Browse products</a></div>;
}

function ProductGallery({ product }) {
  return <section aria-label="Product images"><div className="product-media rounded-lg border border-slate-200" role="img" aria-label={`Photography for ${product.name} is pending`}><Icon name={product.symbol} className="h-24 w-24 text-slate-400"/></div><p className="mt-2 text-xs text-slate-500">Product photography pending</p></section>;
}

function SellerOffer({ offer, selected, onSelect }) {
  return <label className={`block cursor-pointer rounded-md border p-3 ${selected ? 'border-brand ring-1 ring-brand' : 'border-slate-300 hover:border-slate-400'} ${offer.available ? 'bg-white' : 'bg-slate-50 text-slate-500'}`}>
    <span className="flex items-start gap-3"><input type="radio" name="seller-offer" disabled={!offer.available} checked={selected} onChange={onSelect} className="mt-1"/><span className="min-w-0 flex-1"><span className="flex flex-wrap items-center justify-between gap-2"><span className="font-semibold">{offer.seller}</span><span className="font-bold">{offer.available ? formatPrice(offer.price) : 'Unavailable'}</span></span><span className="mt-1 block text-xs text-slate-600">{offer.available ? offer.warranty : 'This seller offer is unavailable in the fixture.'}</span></span></span>
  </label>;
}

export default function ProductPage({ pathname }) {
  const slug = pathname.split('/')[2];
  const detail = productDetails.find((item) => item.slug === slug);
  const product = detail && featuredDevices.find((item) => item.id === detail.productId);
  const [selection, setSelection] = useState(() => ({ variantId: detail?.variantId || '', offerId: '' }));
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  if (!detail || !product) return <div className="min-h-screen"><StoreHeader/><ProductUnavailable/><StoreFooter/></div>;

  const variant = detail.variants.find((item) => item.id === selection.variantId);
  const currentOffer = detail.offers.find((offer) => offer.id === selection.offerId && offer.variantId === selection.variantId && offer.available);
  const currentOffers = detail.offers.filter((offer) => offer.variantId === selection.variantId);
  function chooseVariant(variantId) {
    setSelection((current) => changeVariant(current, variantId, detail.offers));
    setAdded(false);
  }
  function chooseOffer(offer) {
    setSelection((current) => selectOffer(current, variant.id, offer.id, detail.offers));
    setAdded(false);
  }
  function addToCart() {
    if (!currentOffer) return;
    addItem({ productId: product.id, variantId: selection.variantId, offerId: currentOffer.id, quantity: 1 });
    setAdded(true);
  }

  return <div className="min-h-screen"><StoreHeader/><main className="market-shell py-5 sm:py-7">
    <nav aria-label="Breadcrumb" className="text-xs text-slate-500"><a href="/" className="hover:text-brand">Home</a><span className="mx-2">/</span><a href={`/categories/${product.category.toLowerCase()}`} className="hover:text-brand">{product.category}</a><span className="mx-2">/</span><span className="text-slate-700">{product.name}</span></nav>
    <div className="mt-5 grid items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(350px,.85fr)] lg:gap-10">
      <ProductGallery product={product}/>
      <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(280px,.8fr)] lg:grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(300px,.8fr)]">
        <section><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{product.category}</p><h1 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">{product.name}</h1><p className="mt-2 text-sm text-slate-600">{product.detail.replaceAll('Â·', '|')}</p>
          <section className="mt-6"><h2 className="text-base font-semibold">Choose a variant</h2><div className="mt-2 flex flex-wrap gap-2">{detail.variants.map((item) => <label key={item.id} className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm ${selection.variantId === item.id ? 'border-brand bg-blue-50 font-semibold' : 'border-slate-300 bg-white'}`}><input type="radio" name="product-variant" checked={selection.variantId === item.id} onChange={() => chooseVariant(item.id)}/>{item.label}</label>)}</div></section>
          <section className="mt-6"><h2 className="text-base font-semibold">Specifications</h2><ul className="mt-2 divide-y divide-slate-100 rounded-md border border-slate-200 bg-white">{variant?.specs.map((spec) => <li key={spec} className="px-3 py-2.5 text-sm text-slate-700">{spec}</li>)}</ul></section>
          <section className="mt-5 rounded-md border border-slate-200 bg-white p-4"><h2 className="text-sm font-semibold">Compatibility</h2><p className="mt-2 text-sm text-slate-700">Protocol: {product.connectivity}. {product.requiresHub ? 'A hub is listed as required.' : 'No hub is listed as required.'}</p><p className="mt-1 text-xs leading-5 text-slate-600">Compatibility with specific ecosystems and home setups is unknown. Verify requirements before purchase.</p></section>
        </section>
        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-4 sm:p-5"><h2 className="text-base font-semibold">Seller offers</h2><p className="mt-1 text-xs text-slate-600">Choose an offer for the selected variant.</p><fieldset className="mt-3 space-y-2"><legend className="sr-only">Available seller offers for {variant?.label}</legend>{currentOffers.map((offer) => <SellerOffer key={offer.id} offer={offer} selected={selection.offerId === offer.id} onSelect={() => chooseOffer(offer)}/>)}</fieldset>
          {currentOffer ? <div className="mt-4 border-t border-slate-200 pt-4"><p className="text-xs text-slate-600">Selected seller</p><p className="mt-1 font-semibold">{currentOffer.seller}</p><p className="mt-1 text-2xl font-bold">{formatPrice(currentOffer.price)}</p><p className="mt-1 text-sm text-slate-600">Warranty: {currentOffer.warranty}</p></div> : <p className="mt-4 rounded-md bg-slate-50 p-3 text-sm text-slate-600">Select an available seller offer to view its price and terms.</p>}
          <button type="button" disabled={!currentOffer} onClick={addToCart} className="mt-4 min-h-12 w-full rounded-md bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-600">{currentOffer ? 'Add to cart' : 'Choose options'}</button>
          {added && <p role="status" className="mt-2 text-sm text-green-800">Added. <a href="/cart" className="font-semibold underline">View cart</a></p>}
          <p className="mt-3 border-t border-slate-100 pt-3 text-xs leading-5 text-slate-500">Fixture preview. Stock is not reserved and delivery is calculated at checkout.</p>
        </aside>
      </div>
    </div>
  </main><StoreFooter/></div>;
}
