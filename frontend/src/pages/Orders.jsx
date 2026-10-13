import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/common/Loader.jsx";
import { useStoreSettings } from "../context/StoreSettingsContext";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-indigo-100 text-indigo-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const Orders = () => {
  const { settings } = useStoreSettings();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/orders/myorders");
        if (!Array.isArray(data)) {
          throw new Error("Order service returned an invalid response");
        }
        setOrders(data);
      } catch (err) {
        console.error(err);
        setOrders([]);
        setError(err.response?.data?.message || "We couldn't load your orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [refreshIndex]);

  if (loading) return <Loader fullScreen />;

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="mb-6 text-6xl">📦</p>
        <h1 className="mb-2 text-2xl font-bold">Your orders aren’t available right now</h1>
        <p className="mb-8 text-gray-600">{error}</p>
        <button
          type="button"
          onClick={() => setRefreshIndex((index) => index + 1)}
          className="btn-primary"
        >
          Try again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-6">📦</p>
        <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
        <p className="text-gray-600 mb-8">Start shopping to see your orders here</p>
        <Link to="/products" className="btn-primary inline-block">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="card p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500">Order ID</p>
                <p className="font-mono font-semibold">#{order._id.slice(-10).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total</p>
                <p className="font-bold text-primary">{settings.currencySymbol} {order.totalPrice.toFixed(2)}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
                {order.status.toUpperCase()}
              </span>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                order.isPaid ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
              }`}>
                {order.isPaid ? "PAID" : "UNPAID"}
              </span>
            </div>

            <div className="flex flex-wrap gap-3 pt-4 border-t">
              {order.items.map((i) => (
                <div key={i.product} className="flex items-center gap-2 text-sm">
                  <img src={i.image} alt={i.name} className="w-10 h-10 rounded object-cover" />
                  <span className="text-gray-700">{i.name} × {i.quantity}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 text-xs text-gray-500">
              Payment: <span className="font-medium text-gray-700">{order.paymentMethod.toUpperCase()}</span>
              {order.paymentResult?.transactionId && (
                <> · Txn: <span className="font-mono">{order.paymentResult.transactionId.slice(0, 16)}...</span></>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;