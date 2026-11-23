import Icon from '../Icon.jsx';

export default function AuthLayout({ title, description, children, footer }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        <a href="/" className="mx-auto flex w-fit items-center gap-2 text-xl font-extrabold text-ink">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-white shadow-lg shadow-blue-100"><Icon name="hub" className="h-6 w-6" /></span>
          Smart<span className="text-brand">Atlas</span>
        </a>
        <div className="mt-6 rounded-[1.75rem] border border-blue-100 bg-brand-light/50 p-2 shadow-lg shadow-blue-100">
          <section className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-brand">SmartAtlas Marketplace</p>
            <h1 className="mt-3 text-center text-2xl font-extrabold tracking-tight text-ink">{title}</h1>
            <p className="mt-2 text-center text-sm leading-6 text-slate-600">{description}</p>
            <div className="mt-6">{children}</div>
            {footer && <div className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-600">{footer}</div>}
          </section>
        </div>
        <div className="mt-5 flex justify-center gap-6 text-sm">
          <a href="/account" className="font-semibold text-brand hover:underline">View demo account</a>
          <a href="/" className="text-slate-600 hover:text-brand">Storefront</a>
        </div>
      </div>
    </main>
  );
}
