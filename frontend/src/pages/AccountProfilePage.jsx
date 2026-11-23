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

  return (
    <AccountLayout active="profile">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Profile</h1>
      <p className="mt-2 text-sm text-slate-600">Edit the fictional demo customer profile.</p>
      <form onSubmit={save} noValidate className="mt-6 max-w-2xl space-y-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <label className="block text-sm font-semibold text-ink" htmlFor="profile-name">
          Name
          <input id="profile-name" autoComplete="name" value={values.name} onChange={(event) => updateField('name', event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'profile-name-error' : undefined} className="field-control mt-2 min-h-12 font-normal" />
          {errors.name && <span id="profile-name-error" role="alert" className="mt-1.5 block text-sm font-medium text-red-700">{errors.name}</span>}
        </label>
        <label className="block text-sm font-semibold text-ink" htmlFor="profile-email">
          Email address
          <input id="profile-email" type="email" autoComplete="email" value={profile.email} readOnly aria-readonly="true" className="field-control mt-2 min-h-12 cursor-default bg-brand-light/50 font-normal text-slate-600" />
          <span className="mt-1.5 block text-xs text-slate-500">Email changes and verification are deferred.</span>
        </label>
        <label className="block text-sm font-semibold text-ink" htmlFor="profile-phone">
          Phone number
          <input id="profile-phone" type="tel" autoComplete="tel" value={values.phone} onChange={(event) => updateField('phone', event.target.value)} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'profile-phone-error' : undefined} className="field-control mt-2 min-h-12 font-normal" />
          {errors.phone && <span id="profile-phone-error" role="alert" className="mt-1.5 block text-sm font-medium text-red-700">{errors.phone}</span>}
        </label>
        <div className="flex flex-wrap gap-3">
          <button type="submit" className="button-primary min-h-11 px-6">Save</button>
          <button type="button" onClick={cancel} className="button-secondary min-h-11 px-6">Cancel</button>
        </div>
        {message && <p role="status" className="rounded-xl border border-blue-100 bg-brand-light p-3.5 text-sm font-medium text-slate-700">{message}</p>}
        <p className="text-sm text-slate-600">Password changes and contact verification are deferred.</p>
      </form>
    </AccountLayout>
  );
}
