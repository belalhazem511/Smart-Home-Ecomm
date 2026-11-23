import { useEffect, useState } from 'react';
import StoreHeader from '../components/StoreHeader.jsx';
import StoreFooter from '../components/StoreFooter.jsx';
import { useCart } from '../contexts/CartContext.jsx';
import { deliveryOptionsBySeller, featuredDevices, formatMinorUnits, productDetails } from '../data/homeContent.js';
import { getCartSummary } from '../lib/cart.js';
import { calculateCheckoutTotals, calculateDeliveryMinor, hasValidCheckoutItems, highestAllowedStep, resolveCheckoutStep, validateAddress } from '../lib/checkout.js';

const emptyAddress = { fullName: '', phone: '', city: '', street: '', apartment: '' };
const steps = [
  { id: 'address', label: 'Address' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
];
const addressFields = [
  { name: 'fullName', label: 'Full name', autoComplete: 'name' },
  { name: 'phone', label: 'Phone number', autoComplete: 'tel', type: 'tel' },
  { name: 'city', label: 'City', autoComplete: 'address-level2' },
  { name: 'street', label: 'Street address', autoComplete: 'street-address', wide: true },
  { name: 'apartment', label: 'Apartment / floor (optional)', autoComplete: 'address-line2' },
];

function AddressStep({ address, setAddress, showErrors }) {
  const validity = validateAddress(address);
  return <div className="grid gap-4 sm:grid-cols-2">{addressFields.map((field) => <label key={field.name} htmlFor={`checkout-${field.name}`} className={`block text-sm font-medium ${field.wide ? 'sm:col-span-2' : ''}`}>{field.label}<input id={`checkout-${field.name}`} autoComplete={field.autoComplete} type={field.type || 'text'} value={address[field.name]} onChange={(event) => setAddress((current) => ({ ...current, [field.name]: event.target.value }))} aria-invalid={showErrors && field.name !== 'apartment' && !validity[field.name] ? 'true' : undefined} aria-describedby={showErrors && field.name !== 'apartment' && !validity[field.name] ? `checkout-${field.name}-error` : undefined} className="mt-1 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-base"/>{showErrors && field.name !== 'apartment' && !validity[field.name] && <span id={`checkout-${field.name}-error`} role="alert" className="mt-1 block text-xs text-red-700">Enter {field.label.toLowerCase()}.</span>}</label>)}</div>;
}

function DeliveryStep({ sellerGroups, deliveries, setDeliveries }) {
  return <div><h2 className="text-lg font-semibold">Choose delivery for each seller</h2><p className="mt-1 text-sm text-slate-600">Charges are fixture estimates for this preview.</p><div className="mt-4 space-y-3">{sellerGroups.map((group) => <fieldset key={group.seller} className="rounded-md border border-slate-200 p-4"><legend className="px-1 text-sm font-semibold">{group.seller}</legend><div className="divide-y divide-slate-100">{(deliveryOptionsBySeller[group.seller] || []).map((option) => <label key={option.id} className="flex min-h-12 cursor-pointer items-center gap-3 py-2 text-sm"><input type="radio" name={`delivery-${group.seller}`} checked={deliveries[group.seller] === option.id} onChange={() => setDeliveries((current) => ({ ...current, [group.seller]: option.id }))}/><span className="flex-1">{option.label.replace('Â·', '|')}</span><span className="font-semibold">{formatMinorUnits(option.chargeMinor)}</span></label>)}</div></fieldset>)}</div></div>;
}

function PaymentStep({ paymentMethod, setPaymentMethod }) {
  const choices = [['cod', 'Cash on delivery', 'Demo selection only'], ['card', 'Card payment', 'Selection only. Do not enter card details.']];
  return <div><h2 className="text-lg font-semibold">Select a payment method</h2><p className="mt-1 text-sm text-slate-600">No payment details are requested or processed in this preview.</p><fieldset className="mt-4 space-y-2"><legend className="sr-only">Payment methods</legend>{choices.map(([value, label, note]) => <label key={value} className={`flex min-h-16 cursor-pointer items-center gap-3 rounded-md border px-4 ${paymentMethod === value ? 'border-brand bg-blue-50' : 'border-slate-200 bg-white'}`}><input type="radio" name="payment-method" value={value} checked={paymentMethod === value} onChange={() => setPaymentMethod(value)}/><span><span className="block text-sm font-semibold">{label}</span><span className="mt-0.5 block text-xs text-slate-600">{note}</span></span></label>)}</fieldset></div>;
}

function ReviewStep({ address, sellerGroups, deliveries, paymentMethod }) {
  return <div><h2 className="text-lg font-semibold">Review your selections</h2><section className="mt-4 rounded-md border border-slate-200 p-4"><h3 className="text-sm font-semibold">Delivery address</h3><p className="mt-2 text-sm leading-5 text-slate-700">{address.fullName}<br/>{address.phone}<br/>{address.street}{address.apartment ? `, ${address.apartment}` : ''}<br/>{address.city}</p></section><section className="mt-3"><h3 className="text-sm font-semibold">Items and delivery</h3><div className="mt-2 space-y-2">{sellerGroups.map((group) => { const option = (deliveryOptionsBySeller[group.seller] || []).find((item) => item.id === deliveries[group.seller]); return <article key={group.seller} className="rounded-md border border-slate-200 bg-white p-4"><h4 className="text-sm font-semibold">{group.seller}</h4><ul className="mt-2 space-y-1 text-sm text-slate-700">{group.items.map((item) => <li key={`${item.offer.id}-${item.variantId}`}>{item.quantity} x {item.productName} ({item.variantName})</li>)}</ul><p className="mt-3 border-t border-slate-100 pt-2 text-xs text-slate-600">{option?.label} | {formatMinorUnits(option?.chargeMinor || 0)}</p></article>; })}</div></section><section className="mt-4"><h3 className="text-sm font-semibold">Payment method</h3><p className="mt-1 text-sm">{paymentMethod === 'cod' ? 'Cash on delivery (demo selection)' : 'Card payment (selection only)'}</p></section></div>;
}

function OrderSummary({ sellerGroups, deliveries, totals }) {
  return <aside className="h-fit rounded-lg border border-slate-200 bg-white p-4 sm:p-5 xl:sticky xl:top-40"><h2 className="text-base font-semibold">Order summary</h2><div className="mt-3 space-y-3">{sellerGroups.map((group) => { const option = (deliveryOptionsBySeller[group.seller] || []).find((item) => item.id === deliveries[group.seller]); return <div key={group.seller} className="border-b border-slate-100 pb-3"><div className="flex justify-between gap-3 text-sm"><span>{group.seller}</span><span className="font-medium">{formatMinorUnits(group.subtotalMinor)}</span></div><p className="mt-1 text-xs text-slate-500">Delivery: {option ? formatMinorUnits(option.chargeMinor) : 'Choose at next step'}</p></div>; })}</div><div className="mt-3 flex justify-between text-sm"><span>Items</span><span>{formatMinorUnits(totals.itemsSubtotalMinor)}</span></div><div className="mt-2 flex justify-between text-sm"><span>Delivery estimate</span><span>{formatMinorUnits(totals.deliveryMinor)}</span></div><div className="mt-4 flex justify-between gap-3 border-t border-slate-200 pt-3 font-bold"><span>Estimated total</span><span>{formatMinorUnits(totals.estimatedTotalMinor)}</span></div><p className="mt-3 text-xs leading-5 text-slate-500">Fixture estimates only. No order, payment or stock reservation is created.</p></aside>;
}

function CheckoutUnavailable({ hasEntries }) {
  return <div className="min-h-screen"><StoreHeader/><main className="market-shell py-12"><section className="max-w-2xl rounded-lg border border-slate-200 bg-white p-6"><h1 className="text-2xl font-bold">Checkout unavailable</h1><p className="mt-2 text-sm text-slate-600">{hasEntries ? 'One or more cart offers are invalid or no longer available in this preview.' : 'Add an available seller offer to your cart before checkout.'}</p><a href="/cart" className="mt-4 inline-flex min-h-11 items-center rounded-md bg-brand px-4 text-sm font-semibold text-white">Review cart</a></section></main><StoreFooter/></div>;
}

export default function CheckoutPage() {
  const { entries } = useCart();
  const { sellerGroups, itemsSubtotalMinor } = getCartSummary(entries, productDetails, featuredDevices);
  const sellerNames = sellerGroups.map((group) => group.seller);
  const [address, setAddress] = useState(emptyAddress);
  const [deliveries, setDeliveries] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('');
  const [step, setStep] = useState('address');
  const [showAddressErrors, setShowAddressErrors] = useState(false);
  const prerequisites = { address, deliverySelections: deliveries, sellerNames, paymentMethod };
  const allowedStepIndex = highestAllowedStep(prerequisites);

  function changeStep(requested, replace = false) {
    const next = resolveCheckoutStep(requested, prerequisites);
    setStep(next);
    history[replace ? 'replaceState' : 'pushState']({}, '', `/checkout?step=${next}`);
  }
  useEffect(() => {
    const syncStep = () => {
      const requested = new URLSearchParams(location.search).get('step') || 'address';
      const safeStep = resolveCheckoutStep(requested, prerequisites);
      setStep(safeStep);
      if (safeStep !== requested) history.replaceState({}, '', `/checkout?step=${safeStep}`);
    };
    addEventListener('popstate', syncStep);
    syncStep();
    return () => removeEventListener('popstate', syncStep);
  }, [address, deliveries, paymentMethod, sellerNames.join('|')]);

  if (!hasValidCheckoutItems(entries, sellerGroups, productDetails)) return <CheckoutUnavailable hasEntries={entries.length > 0}/>;
  const deliveryMinor = calculateDeliveryMinor(deliveries, sellerGroups, deliveryOptionsBySeller);
  const totals = calculateCheckoutTotals(itemsSubtotalMinor, deliveryMinor);
  const addressValid = Object.values(validateAddress(address)).every(Boolean);
  function continueFromAddress() {
    setShowAddressErrors(true);
    if (addressValid) changeStep('delivery');
  }
  function continueFromDelivery() {
    if (sellerNames.every((seller) => Boolean(deliveries[seller]))) changeStep('payment');
  }
  function continueFromPayment() {
    if (paymentMethod) changeStep('review');
  }
  const stepIndex = steps.findIndex((item) => item.id === step);

  return <div className="min-h-screen"><StoreHeader/><main className="market-shell py-5 sm:py-7">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wide text-brand">Demo checkout</p><h1 className="mt-1 text-2xl font-bold sm:text-3xl">Checkout</h1><p className="mt-1 text-sm text-slate-600">Enter delivery details and review the fixture estimate.</p></div><a href="/cart" className="min-h-11 py-2 text-sm font-semibold text-brand">Back to cart</a></div>
    <nav aria-label="Checkout steps" className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">{steps.map((item, index) => <button key={item.id} type="button" disabled={index > allowedStepIndex} onClick={() => changeStep(item.id)} aria-current={step === item.id ? 'step' : undefined} className={`min-h-11 rounded-md border px-3 text-sm font-semibold ${step === item.id ? 'border-brand bg-blue-50 text-brand' : 'border-slate-200 bg-white'} disabled:cursor-not-allowed disabled:text-slate-400`}>{index + 1}. {item.label}</button>)}</nav>
    <div className="mt-4 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="rounded-lg border border-slate-200 bg-white p-4 sm:p-6">
        {step === 'address' && <><h2 className="text-lg font-semibold">Delivery address</h2><p className="mb-4 mt-1 text-sm text-slate-600">Address information stays in memory only for this demo session.</p><AddressStep address={address} setAddress={setAddress} showErrors={showAddressErrors}/></>}
        {step === 'delivery' && <DeliveryStep sellerGroups={sellerGroups} deliveries={deliveries} setDeliveries={setDeliveries}/>}
        {step === 'payment' && <PaymentStep paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}/>}
        {step === 'review' && <ReviewStep address={address} sellerGroups={sellerGroups} deliveries={deliveries} paymentMethod={paymentMethod}/>}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">{stepIndex > 0 ? <button type="button" onClick={() => changeStep(steps[stepIndex - 1].id)} className="min-h-11 rounded-md border border-slate-300 px-4 text-sm font-semibold">Back</button> : <span/>}{step === 'address' && <button type="button" onClick={continueFromAddress} className="min-h-11 rounded-md bg-brand px-4 text-sm font-semibold text-white">Continue to delivery</button>}{step === 'delivery' && <button type="button" disabled={!sellerNames.every((seller) => Boolean(deliveries[seller]))} onClick={continueFromDelivery} className="min-h-11 rounded-md bg-brand px-4 text-sm font-semibold text-white disabled:bg-slate-200 disabled:text-slate-500">Continue to payment</button>}{step === 'payment' && <button type="button" disabled={!paymentMethod} onClick={continueFromPayment} className="min-h-11 rounded-md bg-brand px-4 text-sm font-semibold text-white disabled:bg-slate-200 disabled:text-slate-500">Review order</button>}{step === 'review' && <button type="button" disabled className="min-h-11 cursor-not-allowed rounded-md bg-slate-200 px-4 text-sm font-semibold text-slate-500">Final submission disabled in demo</button>}</div>
      </section>
      <OrderSummary sellerGroups={sellerGroups} deliveries={deliveries} totals={totals}/>
    </div>
  </main><StoreFooter/></div>;
}
