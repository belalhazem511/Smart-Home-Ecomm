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

  return <AccountLayout active="addresses"><h1 className="text-2xl font-bold sm:text-3xl">Shipping addresses</h1><p className="mt-2 text-slate-600">Saved addresses stay in memory for this demo session only.</p><div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start"><section className="space-y-3" aria-label="Saved addresses">{addresses.length ? addresses.map((address) => <article key={address.id} className="rounded-lg border border-slate-200 bg-white p-4"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-semibold">{address.fullName}</h2>{address.isDefault && <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-brand">Default</span>}</div><p className="mt-2 text-sm text-slate-700">{address.phone}<br/>{address.street}{address.apartment ? `, ${address.apartment}` : ''}<br/>{address.city}</p><div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => editAddress(address)} className="min-h-10 rounded-lg border border-slate-400 px-3 text-sm">Edit</button>{!address.isDefault && <button type="button" onClick={() => setDefaultAddress(address.id)} className="min-h-10 rounded-lg border border-slate-400 px-3 text-sm">Make default</button>}<button type="button" onClick={() => setConfirmDeleteId(address.id)} className="min-h-10 rounded-lg px-3 text-sm text-red-700 underline">Remove</button></div>{confirmDeleteId === address.id && <div role="alertdialog" aria-labelledby={`delete-title-${address.id}`} className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3"><p id={`delete-title-${address.id}`} className="font-medium">Remove this address?</p><div className="mt-3 flex gap-2"><button type="button" onClick={() => { deleteSavedAddress(address.id); setConfirmDeleteId(''); if (editingId === address.id) resetForm(); }} className="min-h-10 rounded-lg bg-red-700 px-3 text-sm font-semibold text-white">Confirm remove</button><button type="button" onClick={() => setConfirmDeleteId('')} className="min-h-10 rounded-lg border border-slate-400 px-3 text-sm">Cancel</button></div></div>}</article>) : <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6"><h2 className="font-semibold">No saved addresses</h2><p className="mt-2 text-sm text-slate-600">Add an address to make it available in this demo session.</p></div>}</section><form onSubmit={saveAddress} noValidate className="rounded-lg border border-slate-200 bg-white p-5"><h2 className="text-xl font-semibold">{editingId ? 'Edit address' : 'Add an address'}</h2><div className="mt-4 space-y-4">{fields.map((field) => <label key={field.name} className="block text-sm font-medium" htmlFor={`address-${field.name}`}>{field.label}<input id={`address-${field.name}`} autoComplete={field.autocomplete} type={field.type || 'text'} required={field.required !== false} value={values[field.name]} onChange={(event) => updateField(field.name, event.target.value)} aria-invalid={Boolean(errors[field.name])} aria-describedby={errors[field.name] ? `address-${field.name}-error` : undefined} className="mt-1 min-h-11 w-full rounded-lg border border-slate-400 bg-white px-3 font-normal"/>{errors[field.name] && <span id={`address-${field.name}-error`} role="alert" className="mt-1 block text-sm text-red-700">{errors[field.name]}</span>}</label>)}</div><div className="mt-5 flex flex-wrap gap-3"><button type="submit" className="min-h-11 rounded-lg bg-brand px-5 font-semibold text-white">{editingId ? 'Save address' : 'Add address'}</button>{editingId && <button type="button" onClick={resetForm} className="min-h-11 rounded-lg border border-slate-400 px-5">Cancel</button>}</div>{message && <p role="status" className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-slate-700">{message}</p>}</form></div></AccountLayout>;
}
