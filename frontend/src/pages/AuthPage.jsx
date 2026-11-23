import { useState } from 'react';
import AuthLayout from '../components/layout/AuthLayout.jsx';
import { validateAuthForm } from '../lib/authValidation.js';

function Field({ id, label, value, onChange, error, type = 'text', autoComplete, required = true, children }) {
  return <div>
    <label htmlFor={id} className="block text-sm font-medium">{label}</label>
    <div className="relative mt-1"><input id={id} name={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} autoComplete={autoComplete} required={required} aria-invalid={error ? 'true' : undefined} aria-describedby={error ? `${id}-error` : undefined} className="min-h-12 w-full rounded-lg border border-slate-400 bg-white px-3 pr-12"/>{children}</div>
    {error && <p id={`${id}-error`} role="alert" className="mt-1 text-sm text-red-700">{error}</p>}
  </div>;
}

function PasswordField({ id, label, value, onChange, error, autoComplete, required = true }) {
  const [visible, setVisible] = useState(false);
  return <Field id={id} label={label} value={value} onChange={onChange} error={error} type={visible ? 'text' : 'password'} autoComplete={autoComplete} required={required}>
    <button type="button" aria-label={visible ? 'Hide password' : 'Show password'} aria-pressed={visible} onClick={() => setVisible(!visible)} className="absolute inset-y-0 right-1 my-1 min-h-10 rounded-md px-2 text-sm font-medium text-brand">{visible ? 'Hide' : 'Show'}</button>
  </Field>;
}

function SignInForm() {
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [demoPreviewEnabled, setDemoPreviewEnabled] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const nextErrors = validateAuthForm('sign-in', values);
    setErrors(nextErrors);
    setDemoPreviewEnabled(false);
    if (Object.keys(nextErrors).length) {
      setMessage('');
      return;
    }
    if (import.meta.env.DEV) {
      const { matchesDemoPreviewCredentials } = await import('../lib/demoPreviewAuth.js');
      if (matchesDemoPreviewCredentials(values, true)) {
        setDemoPreviewEnabled(true);
        setMessage('Demo preview enabled in this page. This does not authenticate you or protect routes.');
        return;
      }
      setMessage('Demo preview credentials were not accepted. Authentication is unavailable.');
      return;
    }
    setMessage('Authentication is unavailable in this preview.');
  }

  return <AuthLayout title="Sign in" description="Sign in to your Smart Home account." footer={<>New here? <a href="/sign-up" className="font-medium text-brand">Create an account</a></>}>
    {import.meta.env.DEV && <aside className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm"><p className="font-semibold">Demo preview</p><p className="mt-1">Email: demo@smarthome.test</p><p>Password: SmartHomeDemo2026!</p><p className="mt-1 text-slate-600">Local preview only. It does not authenticate users or secure pages.</p></aside>}
    <form noValidate onSubmit={submit} className="space-y-4">
      <Field id="email" label="Email address" value={values.email} onChange={(email) => { setValues((current) => ({ ...current, email })); setDemoPreviewEnabled(false); }} error={errors.email} type="email" autoComplete="email"/>
      <PasswordField id="password" label="Password" value={values.password} onChange={(password) => { setValues((current) => ({ ...current, password })); setDemoPreviewEnabled(false); }} error={errors.password} autoComplete="current-password"/>
      <div className="-mt-1 text-right"><a href="/forgot-password" className="text-sm font-medium text-brand">Forgot password?</a></div>
      <button type="submit" className="min-h-12 w-full rounded-lg bg-brand px-5 font-semibold text-white hover:bg-blue-800">Sign in</button>
      {message && <p role="status" className="rounded-lg bg-blue-50 p-3 text-sm text-slate-700">{message}</p>}
      {demoPreviewEnabled && <nav aria-label="Demo preview destinations" className="grid gap-2 border-t border-slate-200 pt-3 text-sm"><a href="/account" className="font-medium text-brand">Customer account preview</a>{[['merchant-nile', 'Nile Smart Store'], ['merchant-cairo', 'Cairo Connected'], ['merchant-delta', 'Delta Home Tech'], ['merchant-living', 'Connected Living']].map(([merchantId, name]) => <a key={merchantId} href={`/seller/${merchantId}`} className="font-medium text-brand">{name} seller preview</a>)}<a href="/admin" className="font-medium text-brand">Admin preview</a><p className="text-xs text-slate-600">Preview links do not authenticate users or secure these routes.</p></nav>}
    </form>
  </AuthLayout>;
}

function SignUpForm() {
  const [values, setValues] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  function update(name, value) { setValues((current) => ({ ...current, [name]: value })); }
  function submit(event) {
    event.preventDefault();
    const nextErrors = validateAuthForm('sign-up', values);
    setErrors(nextErrors);
    setMessage(Object.keys(nextErrors).length ? '' : 'Demo mode: account creation is unavailable. No account was created.');
  }
  return <AuthLayout title="Create your account" description="Use one account to explore the marketplace." footer={<>Already registered? <a href="/sign-in" className="font-medium text-brand">Sign in</a></>}><form noValidate onSubmit={submit} className="space-y-4"><Field id="name" label="Full name" value={values.name} onChange={(value) => update('name', value)} error={errors.name} autoComplete="name"/><Field id="email" label="Email address" value={values.email} onChange={(value) => update('email', value)} error={errors.email} type="email" autoComplete="email"/><PasswordField id="password" label="Password" value={values.password} onChange={(value) => update('password', value)} error={errors.password} autoComplete="new-password"/><PasswordField id="confirmPassword" label="Confirm password" value={values.confirmPassword} onChange={(value) => update('confirmPassword', value)} error={errors.confirmPassword} autoComplete="new-password"/><p className="text-sm text-slate-600">Use 15 to 128 characters. This is a provisional preview rule.</p><button type="submit" className="min-h-12 w-full rounded-lg bg-brand px-5 font-semibold text-white hover:bg-blue-800">Create account</button>{message && <p role="status" className="rounded-lg bg-blue-50 p-3 text-sm text-slate-700">{message}</p>}</form></AuthLayout>;
}

function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  function submit(event) {
    event.preventDefault();
    const errors = validateAuthForm('forgot-password', { email });
    setError(errors.email || '');
    setMessage(errors.email ? '' : 'Demo mode: password recovery is unavailable. No recovery email was sent.');
  }
  return <AuthLayout title="Forgot password?" description="Enter your account email to continue." footer={<>Remembered it? <a href="/sign-in" className="font-medium text-brand">Back to sign in</a></>}><form noValidate onSubmit={submit} className="space-y-4"><Field id="email" label="Email address" value={email} onChange={setEmail} error={error} type="email" autoComplete="email"/><button type="submit" className="min-h-12 w-full rounded-lg bg-brand px-5 font-semibold text-white hover:bg-blue-800">Continue</button>{message && <p role="status" className="rounded-lg bg-blue-50 p-3 text-sm text-slate-700">{message}</p>}</form></AuthLayout>;
}

export default function AuthPage({ pathname }) {
  if (pathname === '/sign-up') return <SignUpForm/>;
  if (pathname === '/forgot-password') return <ForgotPasswordForm/>;
  return <SignInForm/>;
}
