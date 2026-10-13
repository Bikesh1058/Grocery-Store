import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiLock } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useStoreSettings } from "../../context/StoreSettingsContext";

const AdminLogin = () => {
  const { login, logout } = useAuth();
  const { settings } = useStoreSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role !== "admin") {
        await logout({ notify: false });
        toast.error("This account does not have administrator access.");
        return;
      }
      const from = location.state?.from;
      const destination = from?.pathname?.startsWith("/admin")
        ? `${from.pathname}${from.search || ""}${from.hash || ""}`
        : "/admin";
      navigate(destination, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <section className="card w-full max-w-md p-7 sm:p-9">
        <Link to="/" className="mb-8 flex items-center justify-center gap-3">
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt="" className="h-11 w-11 rounded-xl object-contain" />
          ) : (
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-2xl">🥬</span>
          )}
          <span className="text-xl font-extrabold text-primary">{settings.storeName}</span>
        </Link>
        <div className="mb-7 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><FiLock size={21} /></span>
          <h1 className="mt-4 text-2xl font-extrabold text-gray-900">Admin sign in</h1>
          <p className="mt-2 text-sm text-gray-500">Sign in with an administrator account to manage your store.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-gray-700">Email address</span>
            <input type="email" required autoComplete="username" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="input-field" placeholder="admin@example.com" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-gray-700">Password</span>
            <input type="password" required autoComplete="current-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="input-field" placeholder="Enter your password" />
          </label>
          <button type="submit" disabled={loading} className="btn-primary mt-2 w-full">
            {loading ? "Signing in..." : "Sign in to dashboard"}
          </button>
        </form>
        <Link to="/" className="mt-6 block text-center text-sm font-semibold text-gray-500 hover:text-primary">Return to storefront</Link>
      </section>
    </main>
  );
};

export default AdminLogin;
