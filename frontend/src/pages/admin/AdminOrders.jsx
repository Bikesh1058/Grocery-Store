import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader.jsx";
import Message from "../../components/common/Message.jsx";
import api from "../../services/api";
import { useStoreSettings } from "../../context/StoreSettingsContext";

const statuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const AdminOrders = () => {
  const { settings } = useStoreSettings();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const { data } = await api.get("/orders");
      if (!Array.isArray(data)) throw new Error("Invalid order response");
      setOrders(data);
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || "Could not load orders.";
      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    api.get("/orders")
      .then(({ data }) => {
        if (!Array.isArray(data)) throw new Error("Invalid order response");
        setOrders(data);
      })
      .catch((error) => {
        console.error(error);
        const message = error.response?.data?.message || "Could not load orders.";
        setLoadError(message);
        toast.error(message);
      })
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId, status) => {
    setUpdatingOrderId(orderId);
    try {
      const { data } = await api.put(`/orders/${orderId}/status`, { status });
      setOrders((current) => current.map((order) => order._id === orderId ? data : order));
      toast.success("Order status updated.");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Could not update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">Fulfillment</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900">Orders</h1>
        <p className="mt-1 text-sm text-gray-500">Review orders and keep customers up to date on delivery.</p>
      </div>
      {loadError && (
        <Message variant="error">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>{loadError}</span>
            <button type="button" onClick={loadOrders} className="font-bold underline">Try again</button>
          </div>
        </Message>
      )}
      <div className="card overflow-hidden">
        {loading ? <Loader /> : loadError ? null : orders.length === 0 ? (
          <p className="px-6 py-14 text-center text-sm text-gray-500">There are no orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-5 py-3">Order</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Placed</th><th className="px-5 py-3">Total</th><th className="px-5 py-3">Payment</th><th className="px-5 py-3">Status</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-5 py-4 font-mono font-semibold text-gray-700">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="px-5 py-4"><p className="font-semibold text-gray-800">{order.user?.name || "Customer"}</p><p className="text-xs text-gray-500">{order.user?.email}</p></td>
                    <td className="px-5 py-4 text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4 font-bold text-gray-900">{settings.currencySymbol} {Number(order.totalPrice).toLocaleString()}</td>
                    <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${order.isPaid ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>{order.isPaid ? "Paid" : order.paymentMethod?.toUpperCase()}</span></td>
                    <td className="px-5 py-4"><select disabled={updatingOrderId === order._id} aria-label={`Status for order ${order._id}`} value={order.status} onChange={(event) => updateStatus(order._id, event.target.value)} className="rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs font-semibold capitalize text-gray-700 focus:border-primary focus:outline-none disabled:cursor-wait disabled:opacity-60">{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
