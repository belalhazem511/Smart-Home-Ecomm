import { useState } from 'react';
import AccountLayout from '../components/layout/AccountLayout.jsx';
import { useAccount } from '../contexts/AccountContext.jsx';
import { validateProfile } from '../lib/accountState.js';

export default function AccountProfilePage() {
  const { profile, saveProfile } = useAccount();
  const [values, setValues] = useState({ name: profile.name, phone: profile.phone });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  function cancel() {
    setValues({ name: profile.name, phone: profile.phone });
    setErrors({});
    setMessage('');
  }

  function save(event) {
    event.preventDefault();
    const nextErrors = validateProfile(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    saveProfile(values);
    setMessage('Demo profile changes saved for this session only.');
  }

  function updateField(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setMessage('');
  }

  return <AccountLayout active="profile"><h1 className="text-2xl font-bold sm:text-3xl">Profile</h1><p className="mt-2 text-slate-600">Edit the fictional demo customer profile.</p><form onSubmit={save} noValidate className="mt-6 max-w-2xl space-y-5 rounded-lg border border-slate-200 bg-white p-5 sm:p-7"><label className="block text-sm font-medium" htmlFor="profile-name">Name<input id="profile-name" autoComplete="name" value={values.name} onChange={(event) => updateField('name', event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'profile-name-error' : undefined} className="mt-1 min-h-12 w-full rounded-lg border border-slate-400 px-3 font-normal"/>{errors.name && <span id="profile-name-error" role="alert" className="mt-1 block text-sm text-red-700">{errors.name}</span>}</label><label className="block text-sm font-medium" htmlFor="profile-email">Email address<input id="profile-email" type="email" autoComplete="email" value={profile.email} readOnly aria-readonly="true" className="mt-1 min-h-12 w-full rounded-lg border border-slate-300 bg-slate-100 px-3 font-normal text-slate-600"/><span className="mt-1 block text-xs text-slate-600">Email changes and verification are deferred.</span></label><label className="block text-sm font-medium" htmlFor="profile-phone">Phone number<input id="profile-phone" type="tel" autoComplete="tel" value={values.phone} onChange={(event) => updateField('phone', event.target.value)} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'profile-phone-error' : undefined} className="mt-1 min-h-12 w-full rounded-lg border border-slate-400 px-3 font-normal"/>{errors.phone && <span id="profile-phone-error" role="alert" className="mt-1 block text-sm text-red-700">{errors.phone}</span>}</label><div className="flex flex-wrap gap-3"><button type="submit" className="min-h-11 rounded-lg bg-brand px-5 font-semibold text-white">Save</button><button type="button" onClick={cancel} className="min-h-11 rounded-lg border border-slate-400 px-5">Cancel</button></div>{message && <p role="status" className="rounded-lg bg-blue-50 p-3 text-sm text-slate-700">{message}</p>}<p className="text-sm text-slate-600">Password changes and contact verification are deferred.</p></form></AccountLayout>;
}
