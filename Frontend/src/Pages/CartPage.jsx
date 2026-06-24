import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCart, updateCartItem, removeCartItem, clearCart } from "../services/cartService";

const CartPage = () => {
  const [cart, setCart] = useState({ cartItems: [], total: 0 });

  useEffect(() => {
    setCart(getCart());
  }, []);

  const handleQuantityChange = (itemId, quantity) => {
    setCart(updateCartItem(itemId, quantity));
  };

  const handleRemove = (itemId) => {
    setCart(removeCartItem(itemId));
  };

  const handleClear = () => {
    if (!window.confirm("Clear your entire cart?")) return;
    setCart(clearCart());
  };

  const items = cart.cartItems;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">Your cart is empty.</p>
            <Link to="/" className="bg-gray-900 text-white px-6 py-3 rounded-lg">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.productName}</p>
                    <p className="text-gray-500 text-sm">${item.price.toFixed(2)} each</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="w-8 h-8 border rounded-lg flex items-center justify-center hover:bg-gray-100"
                    >−</button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="w-8 h-8 border rounded-lg flex items-center justify-center hover:bg-gray-100"
                    >+</button>
                  </div>

                  <p className="w-20 text-right font-semibold">${item.subtotal.toFixed(2)}</p>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >✕</button>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between text-xl font-bold mb-6">
                <span>Total</span>
                <span>${cart.total.toFixed(2)}</span>
              </div>
              <div className="flex gap-3">
                <button onClick={handleClear} className="border px-4 py-2 rounded-lg hover:bg-gray-50">
                  Clear Cart
                </button>
                <button className="flex-1 bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800">
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;