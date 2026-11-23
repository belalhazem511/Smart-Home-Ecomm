export function filterAndSortDevices(devices, filters) {
  const query = filters.query.trim().toLowerCase();
  return devices.filter((device) => {
    const text = `${device.name} ${device.detail} ${device.category} ${device.connectivity}`.toLowerCase();
    return (!query || text.includes(query))
      && (!filters.category || device.category.toLowerCase() === filters.category.toLowerCase())
      && (!filters.connectivity || device.connectivity === filters.connectivity)
      && (filters.hub === '' || device.requiresHub === (filters.hub === 'required'))
      && (!filters.minPrice || device.price >= Number(filters.minPrice))
      && (!filters.maxPrice || device.price <= Number(filters.maxPrice));
  }).sort((a, b) => filters.sort === 'price-asc' ? a.price - b.price : filters.sort === 'price-desc' ? b.price - a.price : a.name.localeCompare(b.name));
}

export function readCatalogFilters(search, category = '') {
  const params = new URLSearchParams(search);
  return { query: params.get('q') || '', category, connectivity: params.get('connectivity') || '', hub: params.get('hub') || '', minPrice: params.get('min') || '', maxPrice: params.get('max') || '', sort: params.get('sort') || 'relevance', page: Math.max(1, Number(params.get('page')) || 1) };
}

export function buildCatalogUrl(pathname, filters) {
  const params = new URLSearchParams();
  for (const [key, value] of [['q', filters.query], ['connectivity', filters.connectivity], ['hub', filters.hub], ['min', filters.minPrice], ['max', filters.maxPrice], ['sort', filters.sort === 'relevance' ? '' : filters.sort], ['page', filters.page > 1 ? filters.page : '']]) if (value) params.set(key, value);
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
