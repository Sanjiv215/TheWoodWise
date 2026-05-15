export function normalizeCart(cart) {
  return cart.reduce((items, item) => {
    const existing = items.find((cartItem) => cartItem.id === item.id);
    if (existing) {
      existing.quantity += item.quantity || 1;
      return items;
    }

    items.push({ ...item, quantity: item.quantity || 1 });
    return items;
  }, []);
}

export function getCartCount(cart) {
  return cart.reduce((count, item) => count + (item.quantity || 1), 0);
}

export function getCartTotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
}
