const API_BASE = "https://localhost:7042/api/wishlist";
const GUEST_KEY = "guest_wishlist";

const getToken = () => localStorage.getItem("token");

export const isLoggedIn = () => !!getToken();

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// ---- Guest (localStorage) wishlist ----
export const getGuestWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem(GUEST_KEY)) || [];
  } catch {
    return [];
  }
};

export const saveGuestWishlist = (products) => {
  localStorage.setItem(GUEST_KEY, JSON.stringify(products));
};

export const clearGuestWishlist = () => localStorage.removeItem(GUEST_KEY);

// ---- Server (DB) wishlist ----
export const fetchWishlist = async () => {
  const res = await fetch(API_BASE, { headers: authHeaders() });
  if (!res.ok) return [];
  return res.json();
};

export const addWishlistItem = async (productId) => {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ productId }),
  });

  if (!res.ok) {
    console.error("Add to wishlist failed:", res.status);
    return null;
  }

  const data = await res.json();
  return data.message;
};

export const removeWishlistItem = async (productId) => {
  await fetch(`${API_BASE}/${productId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
};

// Call once right after login — merges localStorage wishlist into the DB
export const syncWishlistOnLogin = async (productIds) => {
  const res = await fetch(`${API_BASE}/sync`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ productIds }),
  });
  if (!res.ok) return [];
  return res.json();
};