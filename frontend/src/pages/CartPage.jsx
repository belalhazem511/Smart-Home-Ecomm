import Icon from '../components/Icon.jsx';
import StoreHeader from '../components/StoreHeader.jsx';
import StoreFooter from '../components/StoreFooter.jsx';
import { useCart } from '../contexts/CartContext.jsx';
import { featuredDevices, formatMinorUnits, productDetails } from '../data/homeContent.js';
import { getCartSummary } from '../lib/cart.js';
import { hasValidCheckoutItems } from '../lib/checkout.js';

function CartItem({ item, changeQuantity, removeItem }) {
  const product = featuredDevices.find((device) => device.id === item.productId);
  const detail = productDetails.find((entry) => entry.productId === item.productId);
  const productPath = detail ? `/products/${detail.slug}` : '/shop';
  return <article className="grid gap-3 py-4 sm:grid-cols-[76px_minmax(0,1fr)_auto] sm:items-start">
    <a href={productPath} className="product-media h-[76px] w-[76px] rounded-md border border-slate-200"><Icon name={product?.symbol || 'hub'} className="h-9 w-9"/></a>
    <div className="min-w-0"><a href={productPath} className="font-semibold hover:text-brand">{item.productName}</a><p className="mt-1 text-sm text-slate-600">Variant: {item.variantName}</p><p className="mt-1 text-xs text-slate-600">Sold by {item.offer.seller}</p><p className="mt-2 text-sm font-medium">{formatMinorUnits(item.unitPriceMinor)} each</p><p className="mt-1 text-xs text-slate-500">{item.offer.warranty}</p></div>
    <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end"><p className="font-semibold">{formatMinorUnits(item.lineTotalMinor)}</p><div className="flex items-center gap-3"><label className="flex items-center gap-2 text-xs text-slate-600">Qty<input aria-label={`Quantity for ${item.productName}`} type="number" min="1" max="99" value={item.quantity} onChange={(event) => changeQuantity(item.offer.id, item.variantId, Number(event.target.value))} className="min-h-10 w-16 rounded-md border border-slate-300 bg-white px-2 text-sm text-ink"/></label><button type="button" onClick={() => removeItem(item.offer.id, item.variantId)} className="min-h-10 px-2 text-xs font-semibold text-brand underline">Remove</button></div></div>
  </article>;
}

export default function CartPage() {
  const { entries, changeQuantity, removeItem } = useCart();
  const { sellerGroups, itemsSubtotalMinor } = getCartSummary(entries, productDetails, featuredDevices);
  const canCheckout = hasValidCheckoutItems(entries, sellerGroups, productDetails);
  return <div className="min-h-screen"><StoreHeader/><main className="market-shell py-6">
    <nav aria-label="Breadcrumb" className="text-xs text-slate-500"><a href="/" className="hover:text-brand">Home</a><span className="mx-2">/</span>Cart</nav>
    <h1 className="mt-4 text-2xl font-bold sm:text-3xl">Shopping cart</h1>
    {!canCheckout ? <section className="mt-5 max-w-3xl rounded-lg border border-slate-200 bg-white p-6 sm:p-8"><h2 className="text-lg font-semibold">{entries.length ? 'Some cart items are unavailable' : 'Your cart is empty'}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{entries.length ? 'A saved product, variant or seller offer is no longer available. Return to the shop to review current options.' : 'Find a device and choose an available seller offer to add it here.'}</p><a href="/shop" className="mt-4 inline-flex min-h-11 items-center rounded-md bg-brand px-5 text-sm font-semibold text-white">Browse products</a></section>
      : <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_330px]"><div className="space-y-4">{sellerGroups.map((group) => <section key={group.seller} className="rounded-lg border border-slate-200 bg-white px-4 sm:px-5"><div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 py-3"><h2 className="text-sm font-semibold">Seller: {group.seller}</h2><span className="text-xs text-slate-500">{group.items.length} {group.items.length === 1 ? 'item' : 'items'}</span></div><div className="divide-y divide-slate-100">{group.items.map((item) => <CartItem key={`${item.productId}:${item.variantId}:${item.offer.id}`} item={item} changeQuantity={changeQuantity} removeItem={removeItem}/>)}</div><div className="flex justify-between border-t border-slate-200 py-3 text-sm"><span>Seller subtotal</span><span className="font-semibold">{formatMinorUnits(group.subtotalMinor)}</span></div></section>)}</div>
      <aside className="sticky top-40 h-fit rounded-lg border border-slate-200 bg-white p-5"><h2 className="text-base font-semibold">Order summary</h2><div className="mt-4 flex justify-between text-sm"><span>Items subtotal</span><span>{formatMinorUnits(itemsSubtotalMinor)}</span></div><div className="mt-3 flex justify-between gap-3 text-sm"><span>Delivery</span><span className="text-right text-slate-600">Calculated at checkout</span></div><div className="mt-4 flex justify-between gap-3 border-t border-slate-200 pt-4 font-bold"><span>Total before delivery</span><span>{formatMinorUnits(itemsSubtotalMinor)}</span></div><a href="/checkout" className="mt-5 flex min-h-12 items-center justify-center rounded-md bg-brand px-4 text-sm font-semibold text-white hover:bg-blue-800">Proceed to checkout</a><p className="mt-3 text-xs leading-5 text-slate-500">Fixture prices may not reflect live seller prices. Adding items does not reserve stock.</p></aside>
    </div>}
  </main><StoreFooter/></div>;
}
