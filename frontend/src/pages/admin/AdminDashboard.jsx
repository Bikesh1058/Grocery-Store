import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiBox, FiDollarSign, FiShoppingBag, FiUsers } from "react-icons/fi";
import api from "../../services/api";
import Loader from "../../components/common/Loader.jsx";
import Message from "../../components/common/Message.jsx";
import StatCard from "../../components/admin/StatCard.jsx";
import { useStoreSettings } from "../../context/StoreSettingsContext";

const AdminDashboard = () => {
  const { settings } = useStoreSettings();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    api.get("/admin/dashboard")
      .then(({ data: response }) => setData(response))
      .catch((requestError) => {
        console.error(requestError);
        setError(requestError.response?.data?.message || "Could not load dashboard data.");
      });
  }, [retryCount]);

  if (error) {
    return (
      <Message variant="error">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => {
              setData(null);
              setError("");
              setRetryCount((count) => count + 1);
            }}
            className="font-bold underline"
          >
            Try again
          </button>
        </div>
      </Message>
    );
  }
  if (!data) return <Loader />;

  const money = `${settings.currencySymbol} ${Number(data.paidRevenue || 0).toLocaleString()}`;

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">Store administration</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900">Good to see you</h1>
          <p className="mt-1 text-sm text-gray-500">Here’s what’s happening with {settings.storeName} today.</p>
        </div>
        <Link to="/admin/products" className="btn-primary py-2.5 text-sm">Manage products <FiArrowRight /></Link>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total products" value={data.totalProducts} detail="Products in your catalog" icon={FiBox} tone="green" />
        <StatCard label="Total orders" value={data.totalOrders} detail="Orders placed in your store" icon={FiShoppingBag} tone="blue" />
        <StatCard label="Customers" value={data.totalUsers} detail="Registered customer accounts" icon={FiUsers} tone="violet" />
        <StatCard label="Paid revenue" value={money} detail="Revenue from paid orders" icon={FiDollarSign} tone="amber" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-bold text-gray-900">Recent orders</h2>
              <p className="mt-1 text-xs text-gray-500">Latest customer activity</p>
            </div>
            <Link to="/admin/orders" className="text-sm font-semibold text-primary hover:underline">All orders</Link>
          </div>
          {data.recentOrders.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-gray-500">Orders will appear here when customers check out.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {data.recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-800">{order.user?.name || order.user?.email || "Customer"}</p>
                    <p className="mt-1 text-xs text-gray-500">#{order._id.slice(-8).toUpperCase()} · {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-gray-900">{settings.currencySymbol} {Number(order.totalPrice).toLocaleString()}</p>
                    <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold capitalize ${order.isPaid ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>{order.isPaid ? "Paid" : order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card overflow-hidden">
          <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
            <h2 className="font-bold text-gray-900">Stock alerts</h2>
            <p className="mt-1 text-xs text-gray-500">Products with 5 or fewer units remaining</p>
          </div>
          {data.lowStockProducts.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-gray-500">No low-stock products right now.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {data.lowStockProducts.map((product) => (
                <div key={product._id} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-800">{product.name}</p>
                    <p className="mt-1 text-xs text-gray-500">{product.category}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700">{product.stock} left</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
