import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  fetchWishlist,
  addWishlistItem,
  removeWishlistItem,
  syncWishlistOnLogin,
  getGuestWishlist,
  saveGuestWishlist,
  clearGuestWishlist,
  isLoggedIn,
} from "../services/wishlistService"; // adjust path if yours differs

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setWishlist(isLoggedIn() ? await fetchWishlist() : getGuestWishlist());
      setLoading(false);
    };
    load();
  }, []);

  const isInWishlist = useCallback(
    (productId) => wishlist.some((p) => p.productId === productId),
    [wishlist]
  );

  const toggleWishlist = useCallback(
    async (product) => {
      const alreadyIn = wishlist.some((p) => p.productId === product.productId);

      if (isLoggedIn()) {
        if (alreadyIn) {
          setWishlist((prev) => prev.filter((p) => p.productId !== product.productId));
          await removeWishlistItem(product.productId);
          return null; // removing — no toast
        } else {
          setWishlist((prev) => [...prev, product]);
          const message = await addWishlistItem(product.productId);
          return message; // 👈 critical: must return this
        }
      } else {
        const updated = alreadyIn
          ? wishlist.filter((p) => p.productId !== product.productId)
          : [...wishlist, product];
        setWishlist(updated);
        saveGuestWishlist(updated);
        return alreadyIn ? null : "Added to wishlist"; // 👈 critical: must return this
      }
    },
    [wishlist]
  );

  const syncWishlistAfterLogin = useCallback(async () => {
    const guestIds = getGuestWishlist().map((p) => p.productId);
    const merged = await syncWishlistOnLogin(guestIds);
    setWishlist(merged);
    clearGuestWishlist();
  }, []);

  return (
    <WishlistContext.Provider
      value={{ wishlist, loading, isInWishlist, toggleWishlist, syncWishlistAfterLogin }}
    >
      {children}
    </WishlistContext.Provider>
  );
};