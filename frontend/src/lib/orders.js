export function findOrderById(orders, orderId) {
  return orders.find((order) => order.id === orderId) || null;
}

export function groupSnapshotItemsBySeller(order) {
  const groups = new Map();
  for (const item of order?.items || []) {
    if (!groups.has(item.sellerId)) groups.set(item.sellerId, { sellerId: item.sellerId, sellerName: item.sellerNameSnapshot, items: [], itemsSubtotalMinor: 0, delivery: null });
    const group = groups.get(item.sellerId);
    group.items.push(item);
    group.itemsSubtotalMinor += item.lineTotalMinorSnapshot;
  }
  for (const delivery of order?.sellerDeliveries || []) {
    const group = groups.get(delivery.sellerId);
    if (group) {
      group.delivery = delivery;
      group.discountMinor = delivery.discountMinorSnapshot || 0;
    }
  }
  return [...groups.values()];
}

export function getOrderSnapshotTotals(order) {
  const itemsSubtotalMinor = Number.isInteger(order?.itemsSubtotalMinorSnapshot)
    ? order.itemsSubtotalMinorSnapshot
    : (order?.items || []).reduce((total, item) => total + item.lineTotalMinorSnapshot, 0);
  const deliverySubtotalMinor = Number.isInteger(order?.deliveryMinorSnapshot)
    ? order.deliveryMinorSnapshot
    : (order?.sellerDeliveries || []).reduce((total, delivery) => total + delivery.chargeMinorSnapshot, 0);
  const discountMinor = Number.isInteger(order?.discountMinorSnapshot)
    ? order.discountMinorSnapshot
    : (order?.sellerDeliveries || []).reduce((total, delivery) => total + (delivery.discountMinorSnapshot || 0), 0);
  const totalMinor = Number.isInteger(order?.totalMinorSnapshot)
    ? order.totalMinorSnapshot
    : itemsSubtotalMinor + deliverySubtotalMinor - discountMinor;
  return { itemsSubtotalMinor, discountMinor, deliverySubtotalMinor, totalMinor };
}

export function getOrderCounts(orders) {
  return {
    total: orders.length,
    processing: orders.filter((order) => order.status.startsWith('Processing')).length,
    completed: orders.filter((order) => order.status.startsWith('Completed')).length,
  };
}
