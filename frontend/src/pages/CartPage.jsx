import Icon from '../components/Icon.jsx';
import StoreHeader from '../components/StoreHeader.jsx';
import StoreFooter from '../components/StoreFooter.jsx';
import ProductImage from '../components/ProductImage.jsx';
import { useCart } from '../contexts/CartContext.jsx';
import { featuredDevices, formatMinorUnits, productDetails } from '../data/smartAtlasCatalog.js';
import { getCartSummary } from '../lib/cart.js';
import { hasValidCheckoutItems } from '../lib/checkout.js';

function CartItem({ item, changeQuantity, removeItem }) {
  const product = featuredDevices.find((device) => device.id === item.productId);
  const detail = productDetails.find((entry) => entry.productId === item.productId);
  const productPath = detail ? `/products/${detail.slug}` : '/shop';
  return (
    <article className="grid gap-4 py-5 sm:grid-cols-[96px_minmax(0,1fr)] lg:grid-cols-[96px_minmax(0,1fr)_150px] lg:items-start">
      <a href={productPath} aria-label={`View ${item.productName}`} className="product-media h-24 w-24 rounded-xl border border-slate-200 sm:h-24 sm:w-24"><ProductImage src={product?.image} alt={product?.imageAlt || item.productName} className="h-full w-full rounded-xl" imageClassName="h-full w-full object-contain p-2" /></a>
      <div className="min-w-0">
        <a href={productPath} className="text-base font-bold leading-6 text-ink hover:text-brand">{item.productName}</a>
        <p className="mt-1 text-sm text-slate-600">{item.variantName}</p>
        <p className="mt-1 text-sm text-slate-500">Sold by {item.offer.seller}</p>
        <p className="mt-0.5 text-xs text-slate-400">{item.offer.warranty}</p>
        <p className="mt-2 text-sm font-semibold text-brand">{formatMinorUnits(item.unitPriceMinor)} each</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label htmlFor={`quantity-${item.offer.id}-${item.variantId}`} className="text-xs font-semibold text-slate-600">Qty</label>
          <input id={`quantity-${item.offer.id}-${item.variantId}`} aria-label={`Quantity for ${item.productName}`} type="number" min="1" max="99" value={item.quantity} onChange={(event) => changeQuantity(item.offer.id, item.variantId, Number(event.target.value))} className="field-control w-[72px] px-2 py-1 text-sm" />
          <button type="button" onClick={() => removeItem(item.offer.id, item.variantId)} className="text-sm font-semibold text-red-600 hover:text-red-700">Remove</button>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 pt-3 lg:justify-end lg:border-0 lg:pt-1"><span className="text-xs text-slate-500 lg:hidden">Line total</span><p className="text-lg font-extrabold tabular-nums text-ink">{formatMinorUnits(item.lineTotalMinor)}</p></div>
    </article>
  );
}

export default function CartPage() {
  const { entries, changeQuantity, removeItem, loadSampleCart, hadInvalidEntries } = useCart();
  const { sellerGroups, itemsSubtotalMinor } = getCartSummary(entries, productDetails, featuredDevices);
  const canCheckout = hasValidCheckoutItems(entries, sellerGroups, productDetails);

  return (
    <div className="min-h-screen bg-canvas">
      <StoreHeader />
      <main className="market-shell py-6">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500"><a href="/" className="hover:text-brand">Home</a><span className="mx-2">/</span>Cart</nav>
        <div className="mt-4 flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-brand text-white"><Icon name="cart" className="h-6 w-6" /></span><div><h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Shopping cart</h1><p className="text-sm text-slate-600">{entries.reduce((sum, entry) => sum + entry.quantity, 0)} items in your cart</p></div></div>

        {!canCheckout ? (
          <section className="mt-6 max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-light text-brand"><Icon name="cart" className="h-8 w-8" /></span>
            <h2 className="mt-4 text-xl font-bold text-ink">{entries.length ? 'Some cart items are unavailable' : 'Your cart is empty'}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">{hadInvalidEntries && 'Unavailable or invalid saved cart lines were removed. '}{entries.length ? 'A saved product, variant or seller offer is no longer available. Return to the shop to review current options.' : 'Find a device and choose an available seller offer to add it here.'}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3"><a href="/shop" className="button-primary">Browse products</a>{import.meta.env.DEV && !entries.length && <button type="button" onClick={loadSampleCart} className="button-secondary">Load sample cart</button>}</div>
          </section>
        ) : (
          <div className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-4">
              {sellerGroups.map((group) => (
                <section key={group.seller} className="rounded-2xl border border-slate-200 bg-white px-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 py-4"><h2 className="flex items-center gap-2 text-sm font-bold text-ink"><span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-light text-brand"><Icon name="hub" className="h-4 w-4" /></span>Sold by {group.seller}</h2><span className="text-xs text-slate-500">{group.items.length} {group.items.length === 1 ? 'item' : 'items'}</span></div>
                  <div className="divide-y divide-slate-100">{group.items.map((item) => <CartItem key={`${item.productId}:${item.variantId}:${item.offer.id}`} item={item} changeQuantity={changeQuantity} removeItem={removeItem} />)}</div>
                  <div className="flex justify-between border-t border-slate-100 py-4 text-sm"><span className="text-slate-600">Seller subtotal</span><span className="font-bold tabular-nums text-ink">{formatMinorUnits(group.subtotalMinor)}</span></div>
                </section>
              ))}
            </div>
            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 lg:sticky lg:top-28">
              <h2 className="text-lg font-extrabold text-ink">Order summary</h2>
              <div className="mt-5 flex justify-between text-sm"><span className="text-slate-600">Items subtotal</span><span className="font-semibold tabular-nums">{formatMinorUnits(itemsSubtotalMinor)}</span></div>
              <div className="mt-3 flex justify-between gap-3 text-sm"><span className="text-slate-600">Delivery</span><span className="text-right text-slate-500">Calculated at checkout</span></div>
              <div className="mt-5 flex justify-between gap-3 border-t border-slate-100 pt-5"><span className="font-bold text-ink">Total before delivery</span><span className="text-xl font-extrabold tabular-nums text-brand">{formatMinorUnits(itemsSubtotalMinor)}</span></div>
              <a href="/checkout" className="button-primary mt-6 w-full">Proceed to checkout</a>
              <p className="mt-4 text-xs leading-5 text-slate-500">Fixture prices may not reflect live seller prices. Adding items does not reserve stock.</p>
            </aside>
          </div>
        )}
      </main>
      <StoreFooter />
    </div>
  );
}
