import { Link } from "react-router-dom";
import { useStoreSettings } from "../../context/StoreSettingsContext";

const Footer = () => {
  const { settings } = useStoreSettings();
  return (
  <footer className="mt-20 bg-primary-dark text-white">
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
      <div className="md:col-span-1">
        <Link to="/" className="mb-4 inline-flex items-center gap-2.5">
          {settings.logoUrl ? <img src={settings.logoUrl} alt="" className="h-10 w-10 rounded-xl bg-white object-contain" /> : <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-2xl">🥬</span>}
          <span className="text-xl font-extrabold tracking-tight">{settings.storeName}</span>
        </Link>
        <p className="max-w-xs text-sm leading-6 text-white/65">
          {settings.tagline} Fresh groceries delivered to your doorstep across {settings.address || "Nepal"}.
        </p>
      </div>

      <div>
        <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/90">Explore</h4>
        <ul className="space-y-3 text-sm text-white/65">
          <li><Link to="/products" className="transition hover:text-white">All products</Link></li>
          <li><Link to="/products?category=Fruits" className="transition hover:text-white">Fresh fruits</Link></li>
          <li><Link to="/products?category=Vegetables" className="transition hover:text-white">Vegetables</Link></li>
          <li><Link to="/products?category=Dairy" className="transition hover:text-white">Dairy & eggs</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/90">Your account</h4>
        <ul className="space-y-3 text-sm text-white/65">
          <li><Link to="/login" className="transition hover:text-white">Sign in</Link></li>
          <li><Link to="/register" className="transition hover:text-white">Create an account</Link></li>
          <li><Link to="/orders" className="transition hover:text-white">Track your orders</Link></li>
          <li><Link to="/cart" className="transition hover:text-white">Shopping cart</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/90">Shop with confidence</h4>
        <p className="mb-4 text-sm leading-6 text-white/65">{settings.supportEmail || settings.supportPhone ? <>Questions? {settings.supportEmail && <a href={`mailto:${settings.supportEmail}`} className="hover:text-white">{settings.supportEmail}</a>}{settings.supportEmail && settings.supportPhone ? " · " : ""}{settings.supportPhone && <a href={`tel:${settings.supportPhone}`} className="hover:text-white">{settings.supportPhone}</a>}</> : "Secure checkout, dependable delivery, and carefully selected everyday essentials."}</p>
        <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-green-400" />
          <span className="text-sm font-semibold">eSewa payments</span>
        </div>
      </div>
    </div>
    <div className="border-t border-white/10">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-white/50 sm:px-6 md:flex-row md:items-center md:justify-between">
        <span>© {new Date().getFullYear()} {settings.storeName}. All rights reserved.</span>
        <span>{settings.address || "Nepal"}</span>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
