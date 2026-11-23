import { useState } from 'react';
import SellerPortalLayout from '../components/layout/SellerPortalLayout.jsx';
import { useSellerOffers } from '../contexts/SellerOffersContext.jsx';
import { demoMerchants, demoSellerMemberships, demoSellerOffers } from '../data/demoSeller.js';
import { featuredDevices, productDetails } from '../data/smartAtlasCatalog.js';
import { findDemoMerchant, getMerchantMemberships } from '../lib/sellerOverview.js';
import { findEditableDraft, formatMinorUnitsForInput, validateOfferDraft } from '../lib/sellerOffers.js';

function returnToOffers(merchantId) {
  history.pushState({}, '', `/seller/${encodeURIComponent(merchantId)}/offers`);
  dispatchEvent(new PopStateEvent('popstate'));
}

function Unavailable() {
  return (
    <main className="market-shell py-10 sm:py-14">
      <section className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 text-center sm:p-10">
        <span className="mx-auto block h-1 w-12 rounded-full bg-brand" />
        <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Draft unavailable</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">This draft is unknown, belongs to another merchant, or is not editable. Published offers are read-only.</p>
        <a href="/seller" className="button-primary mt-6">Choose a demo store</a>
      </section>
    </main>
  );
}

function FieldError({ id, children }) {
  return children ? <span id={id} role="alert" className="mt-1 block text-sm font-medium text-red-700">{children}</span> : null;
}

export default function SellerOfferEditorPage({ merchantId, offerId = '' }) {
  const access = findDemoMerchant(merchantId, demoMerchants, demoSellerMemberships);
  const { draftOffers, addDraft, editDraft } = useSellerOffers();
  const editingOffer = offerId ? findEditableDraft(offerId, merchantId, draftOffers) : null;
  const [values, setValues] = useState(() => editingOffer ? {
    productId: editingOffer.productId,
    variantId: editingOffer.variantId,
    sellerSku: editingOffer.sellerSku,
    price: formatMinorUnitsForInput(editingOffer.priceMinor),
    warranty: editingOffer.warranty,
  } : { productId: '', variantId: '', sellerSku: '', price: '', warranty: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  if (!access || (offerId && !editingOffer)) return <Unavailable/>;

  const allOffers = [...demoSellerOffers, ...draftOffers];
  const selectedProduct = productDetails.find((product) => product.productId === values.productId);
  function updateField(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setMessage('');
  }
  function save(event) {
    event.preventDefault();
    const nextErrors = validateOfferDraft(values, merchantId, allOffers, productDetails, offerId);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    if (editingOffer) editDraft(offerId, merchantId, values);
    else if (!addDraft(values, merchantId)) {
      setMessage('This draft could not be saved. Check the values and try again.');
      return;
    }
    returnToOffers(merchantId);
  }
  function productName(productId) {
    return featuredDevices.find((product) => product.id === productId)?.name || productId;
  }
  const basePath = `/seller/${encodeURIComponent(merchantId)}`;
  return (
    <SellerPortalLayout merchantId={merchantId} merchant={access.merchant} merchants={getMerchantMemberships(demoMerchants, demoSellerMemberships)} active="offers">
      <a href={`${basePath}/offers`} className="text-sm font-semibold text-brand hover:underline">Back to offers</a>
      <div className="mt-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{editingOffer ? 'Edit draft offer' : 'Create draft offer'}</h1>
        <p className="mt-3 max-w-2xl rounded-xl border border-blue-100 bg-brand-light px-4 py-3 text-sm leading-6 text-slate-700">Merchant: {access.merchant.name}. New offers remain drafts and are not published or approved.</p>
      </div>
      <form onSubmit={save} noValidate className="mt-6 max-w-2xl space-y-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
        <label className="block text-sm font-semibold text-ink" htmlFor="offer-product">
          Approved product
          <select id="offer-product" value={values.productId} onChange={(event) => { setValues((current) => ({ ...current, productId: event.target.value, variantId: '' })); setErrors((current) => ({ ...current, variantId: undefined })); }} className="field-control mt-2 min-h-12 font-normal">
            <option value="">Choose a product</option>
            {productDetails.map((product) => <option key={product.productId} value={product.productId}>{productName(product.productId)}</option>)}
          </select>
        </label>
        <label className="block text-sm font-semibold text-ink" htmlFor="offer-variant">
          Variant
          <select id="offer-variant" value={values.variantId} onChange={(event) => updateField('variantId', event.target.value)} disabled={!selectedProduct} aria-invalid={Boolean(errors.variantId)} aria-describedby={errors.variantId ? 'offer-variant-error' : undefined} className="field-control mt-2 min-h-12 font-normal disabled:bg-slate-100">
            <option value="">Choose a variant</option>
            {selectedProduct?.variants.map((variant) => <option key={variant.id} value={variant.id}>{variant.label}</option>)}
          </select>
          <FieldError id="offer-variant-error">{errors.variantId}</FieldError>
        </label>
        <label className="block text-sm font-semibold text-ink" htmlFor="offer-sku">
          Seller SKU
          <input id="offer-sku" value={values.sellerSku} onChange={(event) => updateField('sellerSku', event.target.value)} aria-invalid={Boolean(errors.sellerSku)} aria-describedby={errors.sellerSku ? 'offer-sku-error' : undefined} className="field-control mt-2 min-h-12 font-normal" />
          <FieldError id="offer-sku-error">{errors.sellerSku}</FieldError>
          <span className="mt-1 block text-xs text-slate-600">SKU must be unique within this demo merchant.</span>
        </label>
        <label className="block text-sm font-semibold text-ink" htmlFor="offer-price">
          Price (EGP)
          <input id="offer-price" inputMode="decimal" value={values.price} onChange={(event) => updateField('price', event.target.value)} aria-invalid={Boolean(errors.price)} aria-describedby={errors.price ? 'offer-price-error' : undefined} className="field-control mt-2 min-h-12 font-normal" placeholder="0.00" />
          <FieldError id="offer-price-error">{errors.price}</FieldError>
        </label>
        <label className="block text-sm font-semibold text-ink" htmlFor="offer-warranty">
          Warranty information (optional)
          <textarea id="offer-warranty" value={values.warranty} onChange={(event) => updateField('warranty', event.target.value)} rows="3" className="field-control mt-2 min-h-28 font-normal" placeholder="Enter seller-provided terms, or leave blank if not provided." />
          <span className="mt-1 block text-xs text-slate-600">Only enter terms supplied by the seller. This form does not verify or approve coverage.</span>
        </label>
        <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
          <button type="submit" className="button-primary min-h-11 flex-1 sm:flex-none">Save draft</button>
          <button type="button" onClick={() => returnToOffers(merchantId)} className="button-secondary min-h-11 flex-1 sm:flex-none">Cancel</button>
        </div>
        {message && <p role="status" className="rounded-xl border border-slate-200 bg-canvas px-4 py-3 text-sm text-slate-700">{message}</p>}
      </form>
    </SellerPortalLayout>
  );
}
