export const categories = [
  { name: 'Switches', icon: 'switch', note: 'Smart controls' },
  { name: 'Lighting', icon: 'light', note: 'Light your way' },
  { name: 'Sensors', icon: 'sensor', note: 'Know what changes' },
  { name: 'Security', icon: 'security', note: 'Feel at home' },
  { name: 'Curtains', icon: 'curtains', note: 'Set the scene' },
  { name: 'Hubs', icon: 'hub', note: 'Bring devices together' },
];

export const featuredDevices = [
  { id: 'touch-switch', name: 'Zigbee Touch Switch', category: 'Switches', detail: '3 gang · Neutral required', connectivity: 'Zigbee', requiresHub: true, price: 1490, symbol: 'switch' },
  { id: 'wifi-plug', name: 'Smart Wi-Fi Plug', category: 'Switches', detail: 'Wi-Fi · No hub required', connectivity: 'Wi-Fi', requiresHub: false, price: 649, symbol: 'plug' },
  { id: 'motion-sensor', name: 'Motion Sensor', category: 'Sensors', detail: 'Zigbee · Hub required', connectivity: 'Zigbee', requiresHub: true, price: 890, symbol: 'sensor' },
  { id: 'home-hub', name: 'Smart Home Hub', category: 'Hubs', detail: 'Multi-protocol hub', connectivity: 'Multi-protocol', requiresHub: false, price: 2490, symbol: 'hub' },
  { id: 'smart-bulb', name: 'Tunable Smart Bulb', category: 'Lighting', detail: 'Wi-Fi · No hub required', connectivity: 'Wi-Fi', requiresHub: false, price: 520, symbol: 'light' },
  { id: 'door-sensor', name: 'Door Contact Sensor', category: 'Security', detail: 'Zigbee · Hub required', connectivity: 'Zigbee', requiresHub: true, price: 730, symbol: 'security' },
  { id: 'curtain-motor', name: 'Smart Curtain Motor', category: 'Curtains', detail: 'Wi-Fi · No hub required', connectivity: 'Wi-Fi', requiresHub: false, price: 3290, symbol: 'curtains' },
  { id: 'thread-sensor', name: 'Presence Sensor', category: 'Sensors', detail: 'Thread · Hub required', connectivity: 'Thread', requiresHub: true, price: 1790, symbol: 'sensor' },
];

export const productDetails = [
  {
    slug: 'zigbee-touch-switch', productId: 'touch-switch', variantId: 'touch-switch-3g',
    variants: [
      { id: 'touch-switch-3g', label: '3 gang', specs: ['Zigbee', 'Neutral wire required', 'Hub required'] },
      { id: 'touch-switch-2g', label: '2 gang', specs: ['Zigbee', 'Neutral wire required', 'Hub required'] },
    ],
    offers: [
      { id: 'switch-offer-a', variantId: 'touch-switch-3g', seller: 'Nile Smart Store', price: 1490, warranty: '12-month seller warranty', available: true },
      { id: 'switch-offer-b', variantId: 'touch-switch-3g', seller: 'Cairo Connected', price: 1575, warranty: '24-month seller warranty', available: true },
      { id: 'switch-offer-2g', variantId: 'touch-switch-2g', seller: 'Nile Smart Store', price: 1290, warranty: '12-month seller warranty', available: true },
      { id: 'switch-offer-unavailable', variantId: 'touch-switch-2g', seller: 'Cairo Connected', price: 1375, warranty: '12-month seller warranty', available: false },
    ],
  },
  {
    slug: 'smart-wi-fi-plug', productId: 'wifi-plug', variantId: 'wifi-plug-eu',
    variants: [
      { id: 'wifi-plug-eu', label: 'EU plug', specs: ['Wi-Fi', 'No hub required', 'Check outlet compatibility'] },
      { id: 'wifi-plug-uk', label: 'UK plug', specs: ['Wi-Fi', 'No hub required', 'Check outlet compatibility'] },
    ],
    offers: [
      { id: 'plug-offer-eu', variantId: 'wifi-plug-eu', seller: 'Nile Smart Store', price: 649, warranty: '12-month seller warranty', available: true },
      { id: 'plug-offer-uk', variantId: 'wifi-plug-uk', seller: 'Cairo Connected', price: 720, warranty: '12-month seller warranty', available: true },
    ],
  },
  {
    slug: 'motion-sensor', productId: 'motion-sensor', variantId: 'motion-sensor-standard',
    variants: [{ id: 'motion-sensor-standard', label: 'Standard', specs: ['Zigbee', 'Hub required', 'Motion detection range not verified'] }],
    offers: [
      { id: 'sensor-offer-a', variantId: 'motion-sensor-standard', seller: 'Nile Smart Store', price: 890, warranty: '12-month seller warranty', available: true },
      { id: 'sensor-offer-b', variantId: 'motion-sensor-standard', seller: 'Cairo Connected', price: 940, warranty: 'Warranty terms not provided', available: false },
    ],
  },
];

export const deliveryOptionsBySeller = {
  'Nile Smart Store': [
    { id: 'nile-standard', label: 'Standard delivery · 3–5 days', chargeMinor: 3500 },
    { id: 'nile-express', label: 'Express delivery · 1–2 days', chargeMinor: 6500 },
  ],
  'Cairo Connected': [
    { id: 'cairo-standard', label: 'Standard delivery · 3–5 days', chargeMinor: 4200 },
    { id: 'cairo-express', label: 'Express delivery · 1–2 days', chargeMinor: 7000 },
  ],
};

export const formatPrice = (amount) => `EGP ${amount.toLocaleString('en-EG')}`;
export const formatMinorUnits = (amount) => `EGP ${(amount / 100).toLocaleString('en-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
