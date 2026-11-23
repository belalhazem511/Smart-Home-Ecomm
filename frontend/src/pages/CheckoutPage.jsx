import { useEffect, useState } from 'react';
import StoreHeader from '../components/StoreHeader.jsx';
import { useCart } from '../contexts/CartContext.jsx';
import { deliveryOptionsBySeller, featuredDevices, formatMinorUnits, productDetails } from '../data/homeContent.js';
import { getCartSummary } from '../lib/cart.js';
import { calculateCheckoutTotals, calculateDeliveryMinor, hasValidCheckoutItems, highestAllowedStep, resolveCheckoutStep, validateAddress } from '../lib/checkout.js';

const emptyAddress = { fullName: '', phone: '', city: '', street: '', apartment: '' };
const stepLabels = { address: 'Address', delivery: 'Delivery', payment: 'Payment', review: 'Review' };
const addressFields = [
  { name: 'fullName', label: 'Full name', autoComplete: 'name' },
  { name: 'phone', label: 'Phone number', autoComplete: 'tel', type: 'tel' },
  { name: 'city', label: 'City', autoComplete: 'address-level2' },
  { name: 'street', label: 'Street address', autoComplete: 'street-address' },
  { name: 'apartment', label: 'Apartment / floor (optional)', autoComplete: 'address-line2' },
];

function AddressStep({ address, setAddress, showErrors }) {
  const validity = validateAddress(address);
  return <div className="grid gap-4 sm:grid-cols-2">{addressFields.map((field) => <label key={field.name} className={`block text-sm font-medium ${field.name === 'street' ? 'sm:col-span-2' : ''}`}>{field.label}<input autoComplete={field.autoComplete} type={field.type || 'text'} value={address[field.name]} onChange={(event) => setAddress({ ...address, [field.name]: event.target.value })} aria-invalid={showErrors && !validity[field.name] ? 'true' : undefined} className="mt-1 min-h-12 w-full rounded-lg border border-slate-400 bg-white px-3 font-normal"/>{showErrors && !validity[field.name] && <span className="mt-1 block text-sm text-red-700">Enter {field.label.toLowerCase()}.</span>}</label>)}</div>;
}

export default function CheckoutPage() {
  const { entries } = useCart();
  const summary = getCartSummary(entries, productDetails, featuredDevices);
  const { sellerGroups, itemsSubtotalMinor } = summary;
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

  if (!hasValidCheckoutItems(entries, sellerGroups, productDetails)) {
    return <div className="min-h-screen"><StoreHeader/><main className="mx-auto max-w-content px-4 py-16 text-center"><div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-8"><h1 className="text-3xl font-bold">Checkout is unavailable</h1><p className="mt-3 text-slate-600">{entries.length ? 'Your saved cart items are invalid or no longer available in this preview.' : 'Add an available product offer to your cart before starting checkout.'}</p><a href="/cart" className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-brand px-5 font-semibold text-white">View cart</a></div></main></div>;
  }

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

  return <div className="min-h-screen"><StoreHeader/><main className="mx-auto max-w-content px-4 py-7 md:px-6 lg:px-8"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-semibold uppercase tracking-wide text-brand">Demo checkout</p><h1 className="mt-1 text-3xl font-bold">Complete your order details</h1></div><a href="/cart" className="min-h-11 px-2 py-2 text-sm font-medium text-brand">Return to cart</a></div>
    <nav aria-label="Checkout steps" className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">{Object.keys(stepLabels).map((name, index) => <button key={name} type="button" disabled={index > allowedStepIndex} onClick={() => changeStep(name)} aria-current={step === name ? 'step' : undefined} className={`min-h-12 rounded-lg border px-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-45 ${step === name ? 'border-brand bg-blue-50 text-brand' : 'border-slate-300 bg-white'}`}>{index + 1}. {stepLabels[name]}</button>)}</nav>
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]"><section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-7">
      {step === 'address' && <><h2 className="text-xl font-semibold">Delivery address</h2><p className="mt-1 mb-5 text-sm text-slate-600">Required fields are needed to continue. This address stays in memory for this demo.</p><AddressStep address={address} setAddress={setAddress} showErrors={showAddressErrors}/></>}
      {step === 'delivery' && <><h2 className="text-xl font-semibold">Delivery choices</h2><p className="mt-1 text-sm text-slate-600">Choose separately for each seller. Charges are fixture estimates.</p><div className="mt-5 space-y-5">{sellerGroups.map((group) => <fieldset key={group.seller} className="rounded-lg border border-slate-200 p-4"><legend className="px-1 font-semibold">{group.seller}</legend><div className="space-y-2">{(deliveryOptionsBySeller[group.seller] || []).map((option) => <label key={option.id} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg px-2 hover:bg-slate-50"><input type="radio" name={`delivery-${group.seller}`} checked={deliveries[group.seller] === option.id} onChange={() => setDeliveries({ ...deliveries, [group.seller]: option.id })}/><span className="flex-1">{option.label}</span><span className="font-medium">{formatMinorUnits(option.chargeMinor)}</span></label>)}</div></fieldset>)}</div></>}
      {step === 'payment' && <><h2 className="text-xl font-semibold">Payment method</h2><p className="mt-1 text-sm text-slate-600">Choose a method for this preview. No payment details are collected or sent.</p><fieldset className="mt-5 space-y-3"><legend className="sr-only">Available payment methods</legend>{[['cod', 'Cash on delivery (demo selection)'], ['card', 'Card payment (selection only; no card details)']].map(([value, label]) => <label key={value} className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border px-4 ${paymentMethod === value ? 'border-brand bg-blue-50' : 'border-slate-300'}`}><input type="radio" name="payment-method" value={value} checked={paymentMethod === value} onChange={() => setPaymentMethod(value)}/>{label}</label>)}</fieldset></>}
      {step === 'review' && <><h2 className="text-xl font-semibold">Review your selections</h2><section className="mt-5"><h3 className="font-semibold">Address</h3><p className="mt-1 text-slate-700">{address.fullName}<br/>{address.phone}<br/>{address.street}{address.apartment ? `, ${address.apartment}` : ''}<br/>{address.city}</p></section><section className="mt-5"><h3 className="font-semibold">Seller orders and delivery</h3><div className="mt-2 space-y-3">{sellerGroups.map((group) => { const option = (deliveryOptionsBySeller[group.seller] || []).find((item) => item.id === deliveries[group.seller]); return <div key={group.seller} className="rounded-lg bg-slate-50 p-3"><p className="font-medium">{group.seller}</p>{group.items.map((item) => <p key={`${item.offer.id}-${item.variantId}`} className="mt-1 text-sm text-slate-700">{item.quantity} × {item.productName} ({item.variantName})</p>)}<p className="mt-2 text-sm">{option?.label} · {formatMinorUnits(option?.chargeMinor || 0)}</p></div>; })}</div></section><section className="mt-5"><h3 className="font-semibold">Payment method</h3><p className="mt-1">{paymentMethod === 'cod' ? 'Cash on delivery (demo selection)' : 'Card payment (selection only)'}</p></section></>}
      <div className="mt-7 flex flex-wrap justify-between gap-3 border-t border-slate-200 pt-5">{step !== 'address' ? <button type="button" onClick={() => changeStep(Object.keys(stepLabels)[Math.max(0, Object.keys(stepLabels).indexOf(step) - 1)])} className="min-h-11 rounded-lg border border-slate-400 px-5">Back</button> : <span/>}{step === 'address' && <button type="button" onClick={continueFromAddress} className="min-h-11 rounded-lg bg-brand px-5 font-semibold text-white">Continue to delivery</button>}{step === 'delivery' && <button type="button" onClick={continueFromDelivery} className="min-h-11 rounded-lg bg-brand px-5 font-semibold text-white">Continue to payment</button>}{step === 'payment' && <button type="button" disabled={!paymentMethod} onClick={() => changeStep('review')} className="min-h-11 rounded-lg bg-brand px-5 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300">Review order</button>}{step === 'review' && <button type="button" disabled className="min-h-11 cursor-not-allowed rounded-lg bg-slate-300 px-5 font-semibold text-slate-700">Final submission · Disabled in demo</button>}</div>
    </section><aside className="h-fit rounded-xl border border-slate-200 bg-white p-5"><h2 className="text-lg font-semibold">Estimated totals</h2><div className="mt-4 flex justify-between"><span>Items</span><span>{formatMinorUnits(totals.itemsSubtotalMinor)}</span></div><div className="mt-2 flex justify-between"><span>Delivery estimate</span><span>{formatMinorUnits(totals.deliveryMinor)}</span></div><div className="mt-4 flex justify-between gap-3 border-t border-slate-200 pt-4 text-lg font-bold"><span>Estimated total</span><span>{formatMinorUnits(totals.estimatedTotalMinor)}</span></div><p className="mt-3 text-sm text-slate-600">Fixture estimates only. No order is created, payment is processed, or stock reserved.</p></aside></div>
  </main></div>;
}
