import { useState } from 'react';
import AccountLayout from '../components/layout/AccountLayout.jsx';
import { useAccount } from '../contexts/AccountContext.jsx';
import { validateSavedAddress } from '../lib/accountState.js';

const emptyAddress = { fullName: '', phone: '', city: '', street: '', apartment: '' };
const fields = [
  { name: 'fullName', label: 'Full name', autocomplete: 'name' },
  { name: 'phone', label: 'Phone number', autocomplete: 'tel', type: 'tel' },
  { name: 'city', label: 'City', autocomplete: 'address-level2' },
  { name: 'street', label: 'Street address', autocomplete: 'street-address' },
  { name: 'apartment', label: 'Apartment / floor (optional)', autocomplete: 'address-line2', required: false },
];

export default function AccountAddressesPage() {
  const { addresses, addSavedAddress, editSavedAddress, deleteSavedAddress, setDefaultAddress } = useAccount();
  const [editingId, setEditingId] = useState('');
  const [values, setValues] = useState(emptyAddress);
  const [errors, setErrors] = useState({});
  const [confirmDeleteId, setConfirmDeleteId] = useState('');
  const [message, setMessage] = useState('');

  function resetForm() {
    setEditingId(''); setValues(emptyAddress); setErrors({}); setMessage('');
  }

  function editAddress(address) {
    setEditingId(address.id);
    setValues({ fullName: address.fullName, phone: address.phone, city: address.city, street: address.street, apartment: address.apartment || '' });
    setErrors({}); setMessage('');
  }

  function saveAddress(event) {
    event.preventDefault();
    const nextErrors = validateSavedAddress(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    if (editingId) editSavedAddress(editingId, values);
    else addSavedAddress(values);
    resetForm();
    setMessage('Demo address saved for this session only.');
  }

  function updateField(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  return (
    <AccountLayout active="addresses">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Shipping addresses</h1>
      <p className="mt-2 text-sm text-slate-600">Saved addresses stay in memory for this demo session only.</p>
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
        <section className="space-y-4" aria-label="Saved addresses">
          {addresses.length ? addresses.map((address) => (
            <article key={address.id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-base font-bold text-ink">{address.fullName}</h2>
                {address.isDefault && <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-bold text-brand ring-1 ring-inset ring-blue-100">Default</span>}
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-700">{address.phone}<br/>{address.street}{address.apartment ? `, ${address.apartment}` : ''}<br/>{address.city}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={() => editAddress(address)} className="button-secondary px-3 text-sm">Edit</button>
                {!address.isDefault && <button type="button" onClick={() => setDefaultAddress(address.id)} className="button-secondary px-3 text-sm">Make default</button>}
                <button type="button" onClick={() => setConfirmDeleteId(address.id)} className="inline-flex min-h-11 items-center justify-center rounded-lg px-3 text-sm font-semibold text-red-700 underline hover:bg-red-50 hover:text-red-700">Remove</button>
              </div>
              {confirmDeleteId === address.id && (
                <div role="alertdialog" aria-labelledby={`delete-title-${address.id}`} className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                  <p id={`delete-title-${address.id}`} className="font-semibold text-red-900">Remove this address?</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={() => { deleteSavedAddress(address.id); setConfirmDeleteId(''); if (editingId === address.id) resetForm(); }} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-red-700 px-3 text-sm font-semibold text-white hover:bg-red-800">Confirm remove</button>
                    <button type="button" onClick={() => setConfirmDeleteId('')} className="button-secondary px-3 text-sm">Cancel</button>
                  </div>
                </div>
              )}
            </article>
          )) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6">
              <h2 className="font-bold text-ink">No saved addresses</h2>
              <p className="mt-2 text-sm text-slate-600">Add an address to make it available in this demo session.</p>
            </div>
          )}
        </section>

        <form onSubmit={saveAddress} noValidate className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
          <h2 className="text-xl font-extrabold tracking-tight text-ink">{editingId ? 'Edit address' : 'Add an address'}</h2>
          <div className="mt-5 space-y-5">
            {fields.map((field) => (
              <label key={field.name} className="block text-sm font-semibold text-ink" htmlFor={`address-${field.name}`}>
                {field.label}
                <input id={`address-${field.name}`} autoComplete={field.autocomplete} type={field.type || 'text'} required={field.required !== false} value={values[field.name]} onChange={(event) => updateField(field.name, event.target.value)} aria-invalid={Boolean(errors[field.name])} aria-describedby={errors[field.name] ? `address-${field.name}-error` : undefined} className="field-control mt-1.5 min-h-11 font-normal" />
                {errors[field.name] && <span id={`address-${field.name}-error`} role="alert" className="mt-1.5 block text-sm font-medium text-red-700">{errors[field.name]}</span>}
              </label>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="submit" className="button-primary min-h-11 px-6">{editingId ? 'Save address' : 'Add address'}</button>
            {editingId && <button type="button" onClick={resetForm} className="button-secondary min-h-11 px-6">Cancel</button>}
          </div>
          {message && <p role="status" className="mt-4 rounded-xl border border-blue-100 bg-brand-light p-3.5 text-sm font-medium text-slate-700">{message}</p>}
        </form>
      </div>
    </AccountLayout>
  );
}
