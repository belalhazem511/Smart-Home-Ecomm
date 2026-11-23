import { useEffect, useState } from 'react';
import Icon from '../components/Icon.jsx';
import ProductCard from '../components/ProductCard.jsx';
import StoreHeader from '../components/StoreHeader.jsx';
import StoreFooter from '../components/StoreFooter.jsx';
import { categories, featuredDevices } from '../data/smartAtlasCatalog.js';
import { buildCatalogUrl, filterAndSortDevices, readCatalogFilters } from '../lib/catalog.js';

const pageSize = 12;

function FilterFields({ filters, onChange }) {
  return (
    <div className="space-y-5">
      <label className="block text-sm font-semibold text-ink">
        Connectivity
        <select value={filters.connectivity} onChange={(event) => onChange({ ...filters, connectivity: event.target.value, page: 1 })} className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 font-normal">
          <option value="">Any protocol</option>
          <option value="Wi-Fi">Wi-Fi</option>
          <option value="Zigbee">Zigbee</option>
          <option value="Other">Other</option>
        </select>
      </label>
      <label className="block text-sm font-semibold text-ink">
        Hub requirement
        <select value={filters.hub} onChange={(event) => onChange({ ...filters, hub: event.target.value, page: 1 })} className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 font-normal">
          <option value="">Any</option>
          <option value="required">Hub required</option>
          <option value="not-required">No hub required</option>
        </select>
      </label>
      <fieldset>
        <legend className="text-sm font-semibold text-ink">Price (EGP)</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <label className="text-xs text-slate-600">Minimum<input inputMode="numeric" type="number" min="0" value={filters.minPrice} onChange={(event) => onChange({ ...filters, minPrice: event.target.value, page: 1 })} className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 px-2 text-sm text-ink" /></label>
          <label className="text-xs text-slate-600">Maximum<input inputMode="numeric" type="number" min="0" value={filters.maxPrice} onChange={(event) => onChange({ ...filters, maxPrice: event.target.value, page: 1 })} className="mt-1 min-h-11 w-full rounded-lg border border-slate-300 px-2 text-sm text-ink" /></label>
        </div>
      </fieldset>
    </div>
  );
}

function ActiveFilters({ filters, onRemove }) {
  const active = [
    filters.query && ['Search', filters.query, 'query'],
    filters.connectivity && ['Protocol', filters.connectivity, 'connectivity'],
    filters.hub && ['Hub', filters.hub === 'required' ? 'Required' : 'Not required', 'hub'],
    filters.minPrice && ['From', `EGP ${filters.minPrice}`, 'minPrice'],
    filters.maxPrice && ['Up to', `EGP ${filters.maxPrice}`, 'maxPrice'],
  ].filter(Boolean);
  if (!active.length) return null;
  return (
    <ul aria-label="Active filters" className="mt-4 flex flex-wrap gap-2">
      {active.map(([label, value, key]) => (
        <li key={key}>
          <button type="button" onClick={() => onRemove(key)} className="inline-flex min-h-9 items-center gap-2 rounded-full border border-blue-200 bg-brand-light px-3 text-xs font-medium text-brand hover:bg-blue-100">
            {label}: {value}<span aria-hidden="true">×</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function CatalogPage({ pathname }) {
  const slug = pathname.startsWith('/categories/') ? decodeURIComponent(pathname.split('/')[2]) : '';
  const category = categories.find((item) => (item.slug || item.name.toLowerCase()) === slug);
  const [filters, setFilters] = useState(() => readCatalogFilters(location.search, category?.name || ''));
  const [draft, setDraft] = useState(filters);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const sync = () => { const next = readCatalogFilters(location.search, category?.name || ''); setFilters(next); setDraft(next); };
    addEventListener('popstate', sync);
    return () => removeEventListener('popstate', sync);
  }, [category?.name]);

  function apply(next) {
    setFilters(next);
    setDraft(next);
    history.pushState({}, '', buildCatalogUrl(pathname, next));
  }

  const results = filterAndSortDevices(featuredDevices, filters);
  const pages = Math.max(1, Math.ceil(results.length / pageSize));
  const page = Math.min(filters.page, pages);
  const pageResults = results.slice((page - 1) * pageSize, page * pageSize);
  const title = category ? `${category.name}` : filters.query ? `Results for "${filters.query}"` : 'Shop smart-home devices';

  function clear() {
    const cleared = { ...filters, connectivity: '', hub: '', minPrice: '', maxPrice: '', sort: 'relevance', page: 1 };
    apply(cleared);
    setDraft(cleared);
  }
  function removeFilter(key) { apply({ ...filters, [key]: '', page: 1 }); }

  return (
    <div className="min-h-screen">
      <StoreHeader />
      <main className="market-shell py-6">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500"><a href="/" className="hover:text-brand">Home</a><span className="mx-2">/</span>{category?.name || (filters.query ? 'Search' : 'Shop')}</nav>

        <div className="mt-5 overflow-hidden rounded-2xl bg-brand-light px-6 py-7">
          <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-slate-600">{results.length} products · Find the perfect device for smarter living</p>
        </div>

        <ActiveFilters filters={filters} onRemove={removeFilter} />

        <div className="mt-6 grid gap-6 md:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="hidden h-fit rounded-2xl border border-slate-200 bg-white p-5 md:block">
            <div className="mb-5 flex items-center justify-between"><h2 className="text-sm font-bold text-ink">Filter products</h2><button type="button" onClick={clear} className="text-xs font-semibold text-brand hover:underline">Clear all</button></div>
            <FilterFields filters={filters} onChange={apply} />
          </aside>

          <section aria-label="Product results">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <button type="button" onClick={() => { setDraft(filters); setMobileOpen(true); }} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium md:hidden"><Icon name="menu" />Filters</button>
              <label className="ml-auto flex items-center gap-2 text-xs text-slate-600">Sort
                <select value={filters.sort} onChange={(event) => apply({ ...filters, sort: event.target.value, page: 1 })} className="min-h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-ink">
                  <option value="relevance">Recommended</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                </select>
              </label>
            </div>

            {pageResults.length ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">{pageResults.map((device) => <ProductCard key={device.id} device={device} />)}</div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-light text-brand"><Icon name="search" className="h-7 w-7" /></span>
                <h2 className="mt-4 text-lg font-bold text-ink">No products match these filters</h2>
                <p className="mt-1 text-sm text-slate-600">Remove a filter or try a different search.</p>
                <button type="button" onClick={clear} className="button-primary mt-5">Clear filters</button>
              </div>
            )}

            {pages > 1 && (
              <nav aria-label="Pagination" className="mt-7 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3">
                <span className="text-sm text-slate-600">Page {page} of {pages}</span>
                <div className="flex gap-2">
                  <button type="button" disabled={page <= 1} onClick={() => apply({ ...filters, page: page - 1 })} className="button-secondary">Previous</button>
                  <button type="button" disabled={page >= pages} onClick={() => apply({ ...filters, page: page + 1 })} className="button-primary">Next</button>
                </div>
              </nav>
            )}
          </section>
        </div>
      </main>
      <StoreFooter />

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 md:hidden">
          <section role="dialog" aria-modal="true" aria-labelledby="filter-title" className="absolute inset-y-0 right-0 w-full max-w-sm overflow-y-auto bg-white p-5">
            <div className="mb-6 flex items-center justify-between"><h2 id="filter-title" className="text-lg font-bold text-ink">Filter products</h2><button type="button" aria-label="Close filters" onClick={() => { setDraft(filters); setMobileOpen(false); }} className="grid min-h-11 min-w-11 place-items-center rounded-lg border border-slate-300"><Icon name="close" /></button></div>
            <FilterFields filters={draft} onChange={setDraft} />
            <div className="mt-8 flex gap-3">
              <button type="button" onClick={() => setDraft({ ...draft, connectivity: '', hub: '', minPrice: '', maxPrice: '' })} className="button-secondary flex-1">Clear</button>
              <button type="button" onClick={() => { apply({ ...draft, page: 1 }); setMobileOpen(false); }} className="button-primary flex-1">Apply filters</button>
            </div>
            <button type="button" onClick={() => { setDraft(filters); setMobileOpen(false); }} className="mt-3 min-h-11 w-full text-sm text-slate-600">Cancel</button>
          </section>
        </div>
      )}
    </div>
  );
}
