import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiLogOut, FiMenu, FiX, FiArrowRight } from "react-icons/fi";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useStoreSettings } from "../../context/StoreSettingsContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { settings } = useStoreSettings();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setMobileOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition ${
      isActive
        ? "bg-secondary text-primary"
        : "text-gray-600 hover:bg-gray-50 hover:text-primary"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur">
      <div className="hidden bg-primary-dark text-white sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-xs font-medium tracking-wide">
          <span>{settings.announcementText}</span>
          <span className="text-white/40">·</span>
          <span>Free delivery on orders of {settings.currencySymbol} {settings.freeShippingThreshold} or more</span>
        </div>
      </div>
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5" aria-label={`${settings.storeName} home`}>
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt="" className="h-10 w-10 rounded-xl object-contain" />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-2xl">🥬</span>
          )}
          <span className="text-xl font-extrabold tracking-tight text-primary">{settings.storeName}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          <NavLink to="/" end className={navLinkClass}>Home</NavLink>
          <NavLink to="/products" className={navLinkClass}>Shop</NavLink>
          {user && <NavLink to="/orders" className={navLinkClass}>My orders</NavLink>}
          {user?.role === "admin" && <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="flex items-center gap-3 border-r border-gray-200 pr-3">
              <span className="text-sm font-medium text-gray-600">
                Hello, <span className="font-semibold text-gray-900">{user.name?.split(" ")[0] || "there"}</span>
              </span>
              <button
                onClick={handleLogout}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-danger"
                title="Logout"
                aria-label="Logout"
              >
                <FiLogOut className="text-lg" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="px-3 py-2 text-sm font-semibold text-gray-600 transition hover:text-primary">
              Log in
            </Link>
          )}
          <Link
            to="/cart"
            className="relative flex items-center gap-2 rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-primary/30 hover:bg-secondary/50 hover:text-primary"
            aria-label={`Shopping cart, ${totalItems} items`}
          >
            <FiShoppingCart className="text-lg" />
            <span>Cart</span>
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>
          {!user && (
            <Link to="/register" className="btn-primary px-4 py-2.5 text-sm">
              Get started <FiArrowRight />
            </Link>
          )}
        </div>

        <button
          type="button"
          className="rounded-xl p-2 text-gray-700 transition hover:bg-gray-100 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="space-y-1 border-t border-gray-100 bg-white px-4 py-3 md:hidden" aria-label="Mobile navigation">
          <NavLink to="/" end onClick={() => setMobileOpen(false)} className={({ isActive }) => `${navLinkClass({ isActive })} block`}>Home</NavLink>
          <NavLink to="/products" onClick={() => setMobileOpen(false)} className={({ isActive }) => `${navLinkClass({ isActive })} block`}>Shop products</NavLink>
          <NavLink to="/cart" onClick={() => setMobileOpen(false)} className={({ isActive }) => `${navLinkClass({ isActive })} block`}>
            Cart <span className="ml-1 text-gray-400">({totalItems})</span>
          </NavLink>
          {user ? (
            <>
              <NavLink to="/orders" onClick={() => setMobileOpen(false)} className={({ isActive }) => `${navLinkClass({ isActive })} block`}>My orders</NavLink>
              {user.role === "admin" && <NavLink to="/admin" onClick={() => setMobileOpen(false)} className={({ isActive }) => `${navLinkClass({ isActive })} block`}>Admin dashboard</NavLink>}
              <button onClick={handleLogout} className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-danger hover:bg-red-50">Log out</button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-outline py-2.5 text-sm">Log in</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary py-2.5 text-sm">Sign up</Link>
            </div>
          )}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
