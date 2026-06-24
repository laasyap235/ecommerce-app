const CART_KEY = "cart";

export const getCart = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(CART_KEY));
    if (stored && Array.isArray(stored.cartItems)) return stored;
  } catch (e) {}
  return { cartItems: [], total: 0 };
};

export const addToCart = (product) => {
  const cart = getCart();
  const existing = cart.cartItems.find(i => i.productId === product.productId);

  if (existing) {
    existing.quantity += 1;
    existing.subtotal = existing.quantity * existing.price;
  } else {
    cart.cartItems.push({
      id: product.productId,
      productId: product.productId,
      productName: product.name,
      imageUrl: product.imageUrl,
      price: product.price,
      quantity: 1,
      subtotal: product.price,
    });
  }

  cart.total = cart.cartItems.reduce((sum, i) => sum + i.subtotal, 0);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  return cart;
};

export const updateCartItem = (itemId, quantity) => {
  const cart = getCart();
  const item = cart.cartItems.find(i => i.id === itemId);
  if (!item) return cart;

  if (quantity <= 0) {
    cart.cartItems = cart.cartItems.filter(i => i.id !== itemId);
  } else {
    item.quantity = quantity;
    item.subtotal = item.price * quantity;
  }

  cart.total = cart.cartItems.reduce((sum, i) => sum + i.subtotal, 0);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  return cart;
};

export const removeCartItem = (itemId) => {
  const cart = getCart();
  cart.cartItems = cart.cartItems.filter(i => i.id !== itemId);
  cart.total = cart.cartItems.reduce((sum, i) => sum + i.subtotal, 0);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  return cart;
};

export const clearCart = () => {
  const empty = { cartItems: [], total: 0 };
  localStorage.setItem(CART_KEY, JSON.stringify(empty));
  return empty;
};