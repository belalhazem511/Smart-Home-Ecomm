import source from './marketplace-demo.json' with { type: 'json' };

const productAliases = {
  'zigbee-touch-switch': 'touch-switch',
  'smart-wi-fi-plug': 'wifi-plug',
  'motion-sensor': 'motion-sensor',
  'smart-home-hub': 'home-hub',
  'smart-bulb': 'smart-bulb',
  'door-contact-sensor': 'door-sensor',
  'curtain-motor': 'curtain-motor',
  'presence-sensor': 'thread-sensor',
  'smart-door-lock': 'smart-lock',
  'room-thermostat': 'thermostat',
  'indoor-camera': 'indoor-camera',
  'smart-control-panel': 'control-panel',
};

const variantAliases = {
  'zigbee-touch-switch-1-gang': 'touch-switch-1g',
  'zigbee-touch-switch-2-gang': 'touch-switch-2g',
  'zigbee-touch-switch-3-gang': 'touch-switch-3g',
  'smart-wi-fi-plug-eu': 'wifi-plug-eu',
  'smart-wi-fi-plug-uk': 'wifi-plug-uk',
  'motion-sensor-standard': 'motion-sensor-standard',
};

const offerAliases = {
  'offer-zigbee-touch-switch-3-gang-nile': 'switch-offer-a',
  'offer-zigbee-touch-switch-3-gang-cairo': 'switch-offer-b',
  'offer-zigbee-touch-switch-2-gang-nile': 'switch-offer-2g',
  'offer-smart-wi-fi-plug-eu-nile': 'plug-offer-eu',
  'offer-smart-wi-fi-plug-uk-cairo': 'plug-offer-uk',
  'offer-motion-sensor-standard-nile': 'sensor-offer-a',
};

export const demoData = source;
export const productIdFor = (id) => productAliases[id] || id;
export const variantIdFor = (id) => variantAliases[id] || id;
export const offerIdFor = (id) => offerAliases[id] || id;
export const categoryRecords = source.categories;
export const demoMerchants = source.merchants.map((merchant) => ({ ...merchant, region: merchant.city }));
export const demoSellerMemberships = source.merchants.map((merchant) => ({
  userId: merchant.ownerUserId,
  merchantId: merchant.id,
  label: 'Assigned demo merchant membership',
}));

const merchantById = new Map(source.merchants.map((merchant) => [merchant.id, merchant]));
const categoryById = new Map(source.categories.map((category) => [category.id, category]));
const variantById = new Map(source.variants.map((variant) => [variant.id, variant]));
const productById = new Map(source.products.map((product) => [product.id, product]));

export const products = source.products.map((product) => {
  const category = categoryById.get(product.categoryId);
  const detailText = `${product.protocol.replace(/\s*\d+(?:\.\d+)?\s*GHz/i, '')} · ${product.hubRequired ? 'Hub required' : 'No hub required'}`;
  return {
    id: productIdFor(product.id),
    sourceId: product.id,
    slug: product.slug,
    name: product.title,
    category: category?.name || 'Other',
    detail: detailText,
    connectivity: product.protocol.startsWith('Zigbee') ? 'Zigbee' : product.protocol.startsWith('Wi-Fi') ? 'Wi-Fi' : product.protocol.startsWith('Thread') ? 'Thread' : product.protocol.includes('+') ? 'Multi-protocol' : product.protocol,
    requiresHub: product.hubRequired,
    price: null,
    priceMinor: null,
    image: product.image,
    imageAlt: product.imageAlt,
    description: product.description,
    features: product.features,
    specifications: product.specifications,
    compatibilitySummary: product.compatibilitySummary,
  };
});

export const productDetails = source.products.map((product) => {
  const appProductId = productIdFor(product.id);
  const variants = product.variantIds.map((id) => {
    const variant = variantById.get(id);
    return {
      id: variantIdFor(variant.id),
      sourceId: variant.id,
      label: variant.label,
      image: variant.image || (variant.imageNote && variant.imageNote.includes('shown') && !variant.imageNote.includes('EU version') ? product.image : null),
      imageAlt: variant.image ? product.imageAlt : `${product.title} product image`,
      imageNote: variant.imageNote || '',
      specs: [...product.specifications.map((spec) => `${spec.label}: ${spec.value}`), product.protocol, product.hubRequired ? 'Hub required' : 'No hub required'],
    };
  });
  const offers = source.offers.filter((offer) => offer.productId === product.id && offer.status === 'published').map((offer) => {
    const merchant = merchantById.get(offer.merchantId);
    return {
      id: offerIdFor(offer.id),
      sourceId: offer.id,
      productId: appProductId,
      variantId: variantIdFor(offer.variantId),
      merchantId: offer.merchantId,
      seller: merchant.name,
      sellerLogo: merchant.logo,
      sellerSku: offer.sellerSku,
      priceMinor: offer.priceMinor,
      price: offer.priceMinor / 100,
      warranty: offer.warrantySummary,
      available: offer.status === 'published' && offer.stockQuantity > 0,
      status: offer.status,
      stockQuantity: offer.stockQuantity,
      deliveryNote: offer.deliveryNote,
    };
  });
  return {
    slug: product.slug,
    productId: appProductId,
    sourceProductId: product.id,
    variantId: variantIdFor(product.defaultVariantId),
    description: product.description,
    variants,
    offers,
    specifications: product.specifications,
    features: product.features,
    connectivity: product.protocol,
    requiresHub: product.hubRequired,
    compatibilitySummary: product.compatibilitySummary,
  };
});

for (const product of products) {
  const detail = productDetails.find((item) => item.productId === product.id);
  const available = detail.offers.filter((offer) => offer.available);
  if (available.length) {
    product.priceMinor = Math.min(...available.map((offer) => offer.priceMinor));
    product.price = product.priceMinor / 100;
  }
}

export const categories = categoryRecords.map((category) => ({
  name: category.name,
  image: category.image,
  imageAlt: `Illustrative ${category.name.toLowerCase()} product`,
}));
export const featuredDevices = products;
export const demoSellerOffers = source.offers.filter((offer) => offer.status !== 'draft').map((offer) => {
  const product = productById.get(offer.productId);
  const variant = variantById.get(offer.variantId);
  const merchant = merchantById.get(offer.merchantId);
  return {
    id: offerIdFor(offer.id),
    sourceId: offer.id,
    merchantId: offer.merchantId,
    productId: productIdFor(offer.productId),
    variantId: variantIdFor(offer.variantId),
    sellerSku: offer.sellerSku,
    priceMinor: offer.priceMinor,
    warranty: offer.warrantySummary,
    status: offer.status === 'published' ? 'Published' : offer.status === 'pending_review' ? 'Pending review' : offer.status === 'changes_requested' ? 'Changes requested' : 'Suspended',
    stockQuantity: offer.stockQuantity,
    productName: product.title,
    variantName: variant.label,
    merchantName: merchant.name,
  };
});
export const demoSellerDraftOffers = source.offers.filter((offer) => offer.status === 'draft').map((offer) => ({
  id: offerIdFor(offer.id),
  sourceId: offer.id,
  merchantId: offer.merchantId,
  productId: productIdFor(offer.productId),
  variantId: variantIdFor(offer.variantId),
  sellerSku: offer.sellerSku,
  priceMinor: offer.priceMinor,
  warranty: offer.warrantySummary,
  status: 'Draft',
}));

const friendlyOrderStatus = (status) => ({ processing: 'Processing (demo)', delivered: 'Completed (demo)', shipped: 'Shipped (demo)', pending_payment: 'Pending payment (demo)', cancelled: 'Cancelled (demo)', partially_delivered: 'Partially delivered (demo)', returned: 'Returned (demo)' })[status] || `Unknown status: ${status}`;
const friendlyPaymentStatus = (status) => ({ paid: 'Paid (demo)', collected: 'Collected (demo)', pending: 'Pending payment (demo)', failed: 'Payment failed (demo)', due_on_delivery: 'Due on delivery (demo)', refunded: 'Refunded (demo)', not_collected: 'Not collected (demo)' })[status] || `Unknown status: ${status}`;
const sellerOrderById = new Map(source.sellerOrders.map((order) => [order.id, order]));
const shipmentBySellerOrder = new Map(source.shipments.map((shipment) => [shipment.sellerOrderId, shipment]));
const shippingLabel = (status) => ({ delivered: 'Delivered (demo)', shipped: 'Handed to carrier (demo)', processing: 'Preparing (demo)', pending_payment: 'Waiting for payment (demo)', cancelled: 'Cancelled (demo)', returned: 'Returned (demo)' })[status] || `Unknown delivery status: ${status}`;

export function adaptOrder(order) {
  const splits = order.sellerOrderIds.map((id) => sellerOrderById.get(id)).filter(Boolean);
  const deliveries = splits.map((split) => {
    const merchant = merchantById.get(split.merchantId);
    const shipment = shipmentBySellerOrder.get(split.id);
    return {
      sellerId: split.merchantId,
      sellerNameSnapshot: merchant.name,
      methodSnapshot: 'Seller delivery (demo estimate)',
      statusSnapshot: shippingLabel(shipment?.status || split.status),
      chargeMinorSnapshot: split.deliveryMinor,
      discountMinorSnapshot: split.discountMinor,
      trackingSnapshot: shipment?.trackingCode ? `Demo tracking code: ${shipment.trackingCode}` : 'Not available in demo',
    };
  });
  const items = order.items.map((item) => ({
    id: item.id,
    productId: productIdFor(item.productId),
    variantId: variantIdFor(item.variantId),
    offerId: offerIdFor(item.offerId),
    sellerId: item.merchantId,
    sellerNameSnapshot: item.snapshot.sellerName,
    productNameSnapshot: item.snapshot.productTitle,
    variantNameSnapshot: item.snapshot.variantLabel,
    imageSnapshot: item.snapshot.image,
    warrantySnapshot: item.snapshot.warrantySummary,
    unitPriceMinorSnapshot: item.snapshot.unitPriceMinor,
    quantity: item.quantity,
    lineTotalMinorSnapshot: item.lineTotalMinor,
  }));
  const deliveryStatuses = deliveries.map((delivery) => delivery.statusSnapshot);
  const deliveryStatus = deliveryStatuses.length && deliveryStatuses.every((status) => status.startsWith('Delivered')) ? 'Delivered (demo)'
    : deliveryStatuses.some((status) => status.startsWith('Handed')) ? 'Shipped (demo)'
      : deliveryStatuses.some((status) => status.startsWith('Preparing')) ? 'Preparing (demo)'
        : deliveryStatuses.some((status) => status.startsWith('Waiting')) ? 'Waiting for payment (demo)'
          : deliveryStatuses.some((status) => status.startsWith('Returned')) ? 'Returned (demo)'
            : deliveryStatuses.some((status) => status.startsWith('Cancelled')) ? 'Cancelled (demo)' : 'Delivery status unavailable (demo)';
  return {
    id: order.id,
    customerId: order.customerId,
    number: order.id,
    placedAt: order.createdAt.slice(0, 10),
    status: friendlyOrderStatus(order.status),
    paymentStatus: friendlyPaymentStatus(order.paymentStatus),
    deliveryStatus,
    items,
    sellerDeliveries: deliveries,
    itemsSubtotalMinorSnapshot: order.itemsSubtotalMinor,
    discountMinorSnapshot: order.discountMinor,
    deliveryMinorSnapshot: order.deliveryMinor,
    totalMinorSnapshot: order.totalMinor,
    shippingAddressSnapshot: order.shippingAddressSnapshot,
  };
}

export const customerDemoOrders = source.orders.filter((order) => order.customerId === source.meta.defaultCustomerId).map(adaptOrder);
export const allDemoOrders = source.orders.map(adaptOrder);
export const demoCustomer = (() => {
  const customer = source.users.find((user) => user.id === source.meta.defaultCustomerId);
  return { name: customer.name, email: customer.email, phone: customer.phone, label: 'Fictional customer', id: customer.id };
})();
export const demoCustomerAddresses = source.addresses.filter((address) => address.userId === source.meta.defaultCustomerId).map((address) => ({ ...address }));
export const demoSellerOrders = source.sellerOrders.map((order) => {
  const shipment = shipmentBySellerOrder.get(order.id);
  return {
    id: order.id,
    merchantId: order.merchantId,
    orderId: order.orderId,
    sellerOrderNumber: order.id,
    createdAt: order.createdAt.slice(0, 10),
    itemCount: order.itemCount,
    itemsTotalMinor: order.itemsSubtotalMinor,
    orderStatus: friendlyOrderStatus(order.status),
    paymentStatus: friendlyPaymentStatus(order.paymentStatus),
    processingStatus: order.paymentStatus === 'pending' ? 'Waiting for payment' : order.status === 'processing' ? 'Ready for processing' : shipment ? `${shippingLabel(shipment.status).replace(' (demo)', '')}` : friendlyOrderStatus(order.status).replace(' (demo)', ''),
    deliveryMinor: order.deliveryMinor,
    totalMinor: order.totalMinor,
    itemIds: order.itemIds,
  };
});

export const demoMerchantApplications = source.merchantApplications.map((application) => {
  const status = ({ pending_review: 'Awaiting review', changes_requested: 'Information requested', approved: 'Approved', rejected: 'Rejected' })[application.status] || `Unknown status: ${application.status}`;
  const merchant = source.merchants.find((item) => item.id === application.merchantId);
  const owner = source.users.find((item) => item.id === application.applicantUserId);
  return { id: application.id, businessName: application.businessName, city: application.city, submittedAt: application.submittedAt.slice(0, 10), status, merchantId: application.merchantId || '', merchantName: merchant?.name || '', applicant: owner?.name || 'Fictional applicant', note: application.note };
});
export const demoCatalogProposals = source.catalogProposals.map((proposal) => {
  const category = categoryById.get(proposal.categoryId);
  const merchant = merchantById.get(proposal.merchantId);
  return { id: proposal.id, productName: proposal.title, category: category?.name || 'Unknown category', submittedBy: merchant?.name || 'Unassigned demo applicant', submittedAt: proposal.submittedAt.slice(0, 10), status: ({ pending_review: 'Awaiting review', changes_requested: 'Information requested', approved: 'Approved', rejected: 'Rejected' })[proposal.status] || `Unknown status: ${proposal.status}`, merchantId: proposal.merchantId, productId: proposal.productId ? productIdFor(proposal.productId) : '', note: proposal.note };
});
export const demoOfferReviews = source.offerReviews.map((review) => {
  const offer = source.offers.find((item) => item.id === review.offerId);
  const product = offer && productById.get(offer.productId);
  const variant = offer && variantById.get(offer.variantId);
  const merchant = merchantById.get(review.merchantId);
  return { id: review.id, offerId: offerIdFor(review.offerId), merchantId: review.merchantId, productName: product?.title || 'Offer record unavailable', variant: variant?.label || 'Unknown variant', sellerSku: offer?.sellerSku || 'Not supplied', priceMinor: offer?.priceMinor ?? 0, submittedAt: review.submittedAt.slice(0, 10), status: ({ pending_review: 'Awaiting review', changes_requested: 'Information requested', approved: 'Approved', rejected: 'Rejected', suspended: 'Suspended' })[review.status] || `Unknown status: ${review.status}`, merchantName: merchant?.name || 'Unknown merchant' };
});
export const demoAdminUsers = source.users.map((user) => {
  const memberships = source.merchants.filter((merchant) => merchant.ownerUserId === user.id).map((merchant) => merchant.name);
  return { id: user.id, name: user.name, email: user.email, accountType: `${user.role[0].toUpperCase()}${user.role.slice(1)} · ${user.status}`, memberships };
});
export const demoSampleCart = source.demoCart.items.map((item) => ({ productId: productIdFor(item.productId), variantId: variantIdFor(item.variantId), offerId: offerIdFor(item.offerId), quantity: item.quantity }));
export const deliveryOptionsBySeller = Object.fromEntries(source.merchants.map((merchant) => [merchant.name, [{ id: `${merchant.id}-standard`, label: 'Standard delivery · fixture estimate', chargeMinor: merchant.deliveryFeeMinor }]]));
