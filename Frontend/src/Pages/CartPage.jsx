import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, updateCartItem, removeCartItem, clearCart, checkout } from "../services/api";
import Navbar from "../components/Navbar";
import { ShoppingBag, Trash2, ArrowLeft } from "lucide-react";

const CartPage = () => {
  const [cart, setCart] = useState({ cartItems: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);


const handleCheckout = async () => {
      setCheckingOut(true);
      try {
        await checkout();
        navigate("/orders");
      } catch (err) {
        setError("Checkout failed. Please try again.");
      } finally {
        setCheckingOut(false);
      }
    };

  useEffect(() => {
    getCart()
      .then(res => setCart(res.data))
      .catch(() => setError("Failed to load cart."))
      .finally(() => setLoading(false));
  }, []);

  const handleQuantityChange = async (itemId, quantity) => {
    if (quantity <= 0) return handleRemove(itemId);
    try {
      const res = await updateCartItem(itemId, { quantity });
      setCart(res.data);
    } catch {
      setError("Failed to update item.");
    }
  };

  const handleRemove = async (itemId) => {
    try {
      const res = await removeCartItem(itemId);
      setCart(res.data);
    } catch {
      setError("Failed to remove item.");
    }
  };

  const handleClear = async () => {
    if (!window.confirm("Clear your entire cart?")) return;
    try {
      const res = await clearCart();
      setCart(res.data);
    } catch {
      setError("Failed to clear cart.");
    }
  };

  const items = cart?.cartItems ?? [];
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  if (loading) return (
    <>
      <Navbar cartCount={itemCount} />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading cart...</p>
      </div>
    </>
  );

  return (
    <>
      <Navbar cartCount={itemCount} />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-10">

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
              <p className="text-gray-500 mt-1">
                {itemCount === 0 ? "No items" : `${itemCount} item${itemCount > 1 ? "s" : ""}`}
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
            >
              <ArrowLeft size={18} />
              Continue Shopping
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">
              {error}
            </div>
          )}

          {items.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-24 flex flex-col items-center gap-4">
              <ShoppingBag size={56} className="text-gray-300" />
              <p className="text-gray-500 text-lg font-medium">Your cart is empty</p>
              <Link
                to="/"
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-lg font-medium transition"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-5">
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-20 h-20 object-cover rounded-xl border border-gray-100"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/80x80?text=Product"; }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{item.productName}</p>
                      <p className="text-gray-400 text-sm mt-0.5">${item.price.toFixed(2)} each</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 text-gray-600 transition"
                      >−</button>
                      <span className="w-8 text-center font-medium text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 text-gray-600 transition"
                      >+</button>
                    </div>

                    <p className="w-20 text-right font-semibold text-gray-900">${item.subtotal.toFixed(2)}</p>

                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

                  <div className="space-y-3 text-sm text-gray-600 mb-4">
                    <div className="flex justify-between">
                      <span>Subtotal ({itemCount} items)</span>
                      <span>${cart.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-teal-600 font-medium">Free</span>
                    </div>
                    <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-bold text-gray-900">
                      <span>Total</span>
                      <span>${cart.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={checkingOut}
                    className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition"
                  >
                    {checkingOut ? "Placing Order..." : "Checkout"}
                  </button>

                  <button
                    onClick={handleClear}
                    className="w-full mt-3 border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 font-medium py-2.5 rounded-xl transition text-sm"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;