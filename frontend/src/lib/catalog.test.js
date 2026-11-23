import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCatalogUrl, filterAndSortDevices, readCatalogFilters } from './catalog.js';
import { featuredDevices } from '../data/homeContent.js';

const defaults = { query: '', category: '', connectivity: '', hub: '', minPrice: '', maxPrice: '', sort: 'relevance', page: 1 };

test('search, category, connectivity, hub, and price filters compose', () => {
  const filters = { ...defaults, query: 'sensor', category: 'Sensors', connectivity: 'Zigbee', hub: 'required', minPrice: '800', maxPrice: '1000' };
  assert.deepEqual(filterAndSortDevices(featuredDevices, filters).map(({ id }) => id), ['motion-sensor']);
});

test('price sorting is ordered and empty result sets stay empty', () => {
  const sorted = filterAndSortDevices(featuredDevices, { ...defaults, sort: 'price-asc' });
  assert.equal(sorted[0].id, 'smart-bulb');
  assert.deepEqual(filterAndSortDevices(featuredDevices, { ...defaults, query: 'no matching device' }), []);
});

test('filters and page round-trip through the URL', () => {
  const filters = { ...defaults, query: 'motion', connectivity: 'Zigbee', hub: 'required', minPrice: '500', maxPrice: '1200', sort: 'price-desc', page: 2 };
  const url = buildCatalogUrl('/search', filters);
  assert.deepEqual(readCatalogFilters(url.slice(url.indexOf('?')), ''), filters);
});
