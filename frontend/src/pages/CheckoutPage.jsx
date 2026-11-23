import { useEffect, useState } from 'react';
import StoreHeader from '../components/StoreHeader.jsx';
import StoreFooter from '../components/StoreFooter.jsx';
import ProductImage from '../components/ProductImage.jsx';
import { useCart } from '../contexts/CartContext.jsx';
import { deliveryOptionsBySeller, featuredDevices, formatMinorUnits, productDetails } from '../data/smartAtlasCatalog.js';
import { getCartSummary } from '../lib/cart.js';
import { calculateCheckoutTotals, calculateDeliveryMinor, hasValidCheckoutItems, highestAllowedStep, resolveCheckoutStep, validateAddress } from '../lib/checkout.js';
import { useAccount } from '../contexts/AccountContext.jsx';

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
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {addressFields.map((field) => (
        <label
          key={field.name}
          htmlFor={`checkout-${field.name}`}
          className={`block text-sm font-semibold text-ink ${field.wide ? 'sm:col-span-2' : ''}`}
        >
          {field.label}
          <input
            id={`checkout-${field.name}`}
            autoComplete={field.autoComplete}
            type={field.type || 'text'}
            value={address[field.name]}
            onChange={(event) => setAddress((current) => ({ ...current, [field.name]: event.target.value }))}
            aria-invalid={showErrors && field.name !== 'apartment' && !validity[field.name] ? 'true' : undefined}
            aria-describedby={showErrors && field.name !== 'apartment' && !validity[field.name] ? `checkout-${field.name}-error` : undefined}
            className="field-control mt-2 min-h-11 text-base"
          />
          {showErrors && field.name !== 'apartment' && !validity[field.name] && (
            <span id={`checkout-${field.name}-error`} role="alert" className="mt-1 block text-xs font-medium text-red-700">
              Enter {field.label.toLowerCase()}.
            </span>
          )}
        </label>
      ))}
    </div>
  );
}

function DeliveryStep({ sellerGroups, deliveries, setDeliveries }) {
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-ink sm:text-xl">Choose delivery for each seller</h2>
          <p className="mt-1 text-sm text-slate-600">Charges are fixture estimates for this preview.</p>
        </div>
        <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">Per seller</span>
      </div>
      <div className="mt-5 space-y-4">
        {sellerGroups.map((group) => (
          <fieldset key={group.seller} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <legend className="px-2 text-sm font-bold text-ink">{group.seller}</legend>
            <div className="mt-2 divide-y divide-slate-100">
              {(deliveryOptionsBySeller[group.seller] || []).map((option) => (
                <label key={option.id} className="flex min-h-12 cursor-pointer items-center gap-3 py-2 text-sm text-ink">
                  <input
                    type="radio"
                    name={`delivery-${group.seller}`}
                    checked={deliveries[group.seller] === option.id}
                    onChange={() => setDeliveries((current) => ({ ...current, [group.seller]: option.id }))}
                    className="h-4 w-4 accent-brand"
                  />
                  <span className="flex-1">{option.label.replace('Â·', '|')}</span>
                  <span className="font-bold tabular-nums text-brand">{formatMinorUnits(option.chargeMinor)}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
    </div>
  );
}

function PaymentStep({ paymentMethod, setPaymentMethod }) {
  const choices = [['cod', 'Cash on delivery', 'Demo selection only'], ['card', 'Card payment', 'Selection only. Do not enter card details.']];
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-ink sm:text-xl">Select a payment method</h2>
          <p className="mt-1 text-sm text-slate-600">No payment details are requested or processed in this preview.</p>
        </div>
        <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">Demo only</span>
      </div>
      <fieldset className="mt-5 space-y-3">
        <legend className="sr-only">Payment methods</legend>
        {choices.map(([value, label, note]) => (
          <label
            key={value}
            className={`flex min-h-16 cursor-pointer items-center gap-3 rounded-2xl border px-4 transition-colors ${paymentMethod === value ? 'border-brand bg-brand-light ring-1 ring-brand' : 'border-slate-200 bg-white hover:border-slate-300'}`}
          >
            <input
              type="radio"
              name="payment-method"
              value={value}
              checked={paymentMethod === value}
              onChange={() => setPaymentMethod(value)}
              className="h-4 w-4 accent-brand"
            />
            <span>
              <span className="block text-sm font-bold text-ink">{label}</span>
              <span className="mt-0.5 block text-xs text-slate-600">{note}</span>
            </span>
          </label>
        ))}
      </fieldset>
    </div>
  );
}

function ReviewStep({ address, sellerGroups, deliveries, paymentMethod }) {
  return (
    <div>
      <h2 className="text-lg font-bold tracking-tight text-ink sm:text-xl">Review your selections</h2>
      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-brand" />
          <h3 className="text-sm font-bold text-ink">Delivery address</h3>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-700">{address.fullName}<br/>{address.phone}<br/>{address.street}{address.apartment ? `, ${address.apartment}` : ''}<br/>{address.city}</p>
      </section>
      <section className="mt-5">
        <h3 className="text-sm font-bold text-ink">Items and delivery</h3>
        <div className="mt-3 space-y-3">
          {sellerGroups.map((group) => {
            const option = (deliveryOptionsBySeller[group.seller] || []).find((item) => item.id === deliveries[group.seller]);
            return (
              <article key={group.seller} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                <h4 className="text-sm font-bold text-ink">{group.seller}</h4>
                <ul className="mt-3 divide-y divide-slate-100 text-sm text-slate-700">
                  {group.items.map((item) => {
                    const product = featuredDevices.find((entry) => entry.id === item.productId);
                    return (
                      <li key={`${item.offer.id}-${item.variantId}`} className="flex items-center gap-3 py-2">
                        <ProductImage src={product?.image} alt="" className="product-media h-12 w-12 rounded-xl border border-slate-200" imageClassName="h-full w-full object-contain p-1"/>
                        <span>{item.quantity} x {item.productName} ({item.variantName})</span>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-600">{option?.label} | {formatMinorUnits(option?.chargeMinor || 0)}</p>
              </article>
            );
          })}
        </div>
      </section>
      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-brand" />
          <h3 className="text-sm font-bold text-ink">Payment method</h3>
        </div>
        <p className="mt-3 text-sm text-ink">{paymentMethod === 'cod' ? 'Cash on delivery (demo selection)' : 'Card payment (selection only)'}</p>
      </section>
    </div>
  );
}

function OrderSummary({ sellerGroups, deliveries, totals }) {
  return (
    <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 xl:sticky xl:top-40">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold tracking-tight text-ink">Order summary</h2>
        <span className="rounded-full bg-brand-light px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand">Estimate</span>
      </div>
      <div className="mt-5 space-y-4">
        {sellerGroups.map((group) => {
          const option = (deliveryOptionsBySeller[group.seller] || []).find((item) => item.id === deliveries[group.seller]);
          return (
            <div key={group.seller} className="border-b border-slate-100 pb-4">
              <div className="flex justify-between gap-3 text-sm">
                <span className="font-semibold text-ink">{group.seller}</span>
                <span className="font-bold tabular-nums">{formatMinorUnits(group.subtotalMinor)}</span>
              </div>
              <ul className="mt-3 space-y-2">
                {group.items.map((item) => {
                  const product = featuredDevices.find((entry) => entry.id === item.productId);
                  return (
                    <li key={`${item.offer.id}-${item.variantId}`} className="flex items-center gap-2 text-xs text-slate-600">
                      <ProductImage src={product?.image} alt="" className="product-media h-9 w-9 rounded-lg border border-slate-200" imageClassName="h-full w-full object-contain p-0.5"/>
                      <span className="min-w-0 flex-1">{item.productName} · {item.variantName} × {item.quantity}</span>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-2 text-xs text-slate-500">Delivery: {option ? formatMinorUnits(option.chargeMinor) : 'Choose at next step'}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-5 space-y-2 text-sm">
        <div className="flex justify-between text-slate-600"><span>Items</span><span className="font-semibold tabular-nums text-ink">{formatMinorUnits(totals.itemsSubtotalMinor)}</span></div>
        <div className="flex justify-between text-slate-600"><span>Delivery estimate</span><span className="font-semibold tabular-nums text-ink">{formatMinorUnits(totals.deliveryMinor)}</span></div>
      </div>
      <div className="mt-5 flex justify-between gap-3 border-t border-slate-200 pt-4 text-base font-bold text-ink">
        <span>Estimated total</span>
        <span className="tabular-nums text-brand">{formatMinorUnits(totals.estimatedTotalMinor)}</span>
      </div>
      <p className="mt-4 rounded-xl bg-brand-light/50 p-3 text-xs leading-5 text-slate-500">Fixture estimates only. No order, payment or stock reservation is created.</p>
    </aside>
  );
}

function CheckoutUnavailable({ hasEntries }) {
  return (
    <div className="min-h-screen bg-canvas">
      <StoreHeader/>
      <main className="market-shell py-14">
        <section className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <span aria-hidden="true" className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-light text-lg font-bold text-brand">!</span>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-ink">Checkout unavailable</h1>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">{hasEntries ? 'One or more cart offers are invalid or no longer available in this preview.' : 'Add an available seller offer to your cart before checkout.'}</p>
          <a href="/cart" className="button-primary mt-5">Review cart</a>
        </section>
      </main>
      <StoreFooter/>
    </div>
  );
}

export default function CheckoutPage() {
  const { entries } = useCart();
  const { addresses } = useAccount();
  const { sellerGroups, itemsSubtotalMinor } = getCartSummary(entries, productDetails, featuredDevices);
  const sellerNames = sellerGroups.map((group) => group.seller);
  const [address, setAddress] = useState(() => {
    const saved = addresses.find((item) => item.isDefault) || addresses[0];
    return saved ? { fullName: saved.fullName, phone: saved.phone, city: saved.city, street: saved.street, apartment: saved.apartment || saved.building || '' } : emptyAddress;
  });
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

  return (
    <div className="min-h-screen bg-canvas">
      <StoreHeader/>
      <main className="market-shell py-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand">Demo checkout</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Checkout</h1>
            <p className="mt-1 text-sm text-slate-600">Enter delivery details and review the fixture estimate.</p>
          </div>
          <a href="/cart" className="button-quiet min-h-11 px-3 text-sm font-semibold">Back to cart</a>
        </div>

        <nav aria-label="Checkout steps" className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {steps.map((item, index) => (
            <button
              key={item.id}
              type="button"
              disabled={index > allowedStepIndex}
              onClick={() => changeStep(item.id)}
              aria-current={step === item.id ? 'step' : undefined}
              className={`min-h-11 rounded-xl border px-3 text-sm font-bold transition-colors ${step === item.id ? 'border-brand bg-brand-light text-brand ring-1 ring-brand' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'} disabled:cursor-not-allowed disabled:bg-white disabled:text-slate-400`}
            >
              {index + 1}. {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            {step === 'address' && (
              <>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold tracking-tight text-ink sm:text-xl">Delivery address</h2>
                    <p className="mb-5 mt-1 text-sm text-slate-600">Address information stays in memory only for this demo session.</p>
                  </div>
                  <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand">Step 1 of 4</span>
                </div>
                <AddressStep address={address} setAddress={setAddress} showErrors={showAddressErrors}/>
              </>
            )}
            {step === 'delivery' && <DeliveryStep sellerGroups={sellerGroups} deliveries={deliveries} setDeliveries={setDeliveries}/>}
            {step === 'payment' && <PaymentStep paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}/>}
            {step === 'review' && <ReviewStep address={address} sellerGroups={sellerGroups} deliveries={deliveries} paymentMethod={paymentMethod}/>}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
              {stepIndex > 0 ? <button type="button" onClick={() => changeStep(steps[stepIndex - 1].id)} className="button-secondary">Back</button> : <span/>}
              {step === 'address' && <button type="button" onClick={continueFromAddress} className="button-primary">Continue to delivery</button>}
              {step === 'delivery' && <button type="button" disabled={!sellerNames.every((seller) => Boolean(deliveries[seller]))} onClick={continueFromDelivery} className="button-primary disabled:bg-slate-200 disabled:text-slate-500">Continue to payment</button>}
              {step === 'payment' && <button type="button" disabled={!paymentMethod} onClick={continueFromPayment} className="button-primary disabled:bg-slate-200 disabled:text-slate-500">Review order</button>}
              {step === 'review' && <button type="button" disabled className="button-secondary cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500">Final submission disabled in demo</button>}
            </div>
          </section>
          <OrderSummary sellerGroups={sellerGroups} deliveries={deliveries} totals={totals}/>
        </div>
      </main>
      <StoreFooter/>
    </div>
  );
}
