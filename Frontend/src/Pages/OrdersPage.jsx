import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../services/api";
import Navbar from "../components/Navbar";
import { Package, ChevronDown, ChevronUp } from "lucide-react";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getOrders()
      .then(res => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const toggleOrder = (id) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Loading orders...</p>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-24 flex flex-col items-center gap-4">
              <Package size={56} className="text-gray-300" />
              <p className="text-gray-500 text-lg font-medium">No orders yet</p>
              <button
                onClick={() => navigate("/")}
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-lg font-medium transition"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div
                    className="flex items-center justify-between p-6 cursor-pointer"
                    onClick={() => toggleOrder(order.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-teal-50 p-3 rounded-xl">
                        <Package size={20} className="text-teal-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Order #{order.id}</p>
                        <p className="text-sm text-gray-400 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric", month: "long", day: "numeric"
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                        order.status === "Pending"
                          ? "bg-yellow-50 text-yellow-600"
                          : order.status === "Delivered"
                          ? "bg-green-50 text-green-600"
                          : "bg-blue-50 text-blue-600"
                      }`}>
                        {order.status}
                      </span>
                      <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                      {expandedOrder === order.id
                        ? <ChevronUp size={18} className="text-gray-400" />
                        : <ChevronDown size={18} className="text-gray-400" />
                      }
                    </div>
                  </div>

                  {expandedOrder === order.id && (
                    <div className="border-t border-gray-100 divide-y divide-gray-50">
                      {order.orderItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 px-6 py-4">
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-16 h-16 object-cover rounded-xl border border-gray-100"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/64x64?text=Product"; }}
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.productName}</p>
                            <p className="text-sm text-gray-400 mt-0.5">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                          </div>
                          <p className="font-semibold text-gray-900">${item.subtotal.toFixed(2)}</p>
                        </div>
                      ))}

                      <div className="px-6 py-4 flex justify-end">
                        <div className="text-right">
                          <p className="text-sm text-gray-400">Order Total</p>
                          <p className="text-xl font-bold text-gray-900">${order.total.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrdersPage;