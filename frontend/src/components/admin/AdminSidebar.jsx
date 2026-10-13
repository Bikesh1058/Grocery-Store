import { FiBarChart2, FiBox, FiClipboard, FiSettings, FiX } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { useStoreSettings } from "../../context/StoreSettingsContext";

const links = [
  { to: "/admin", label: "Overview", icon: FiBarChart2, end: true },
  { to: "/admin/products", label: "Products", icon: FiBox },
  { to: "/admin/orders", label: "Orders", icon: FiClipboard },
  { to: "/admin/settings", label: "Store settings", icon: FiSettings },
];

const AdminSidebar = ({ open, onClose }) => {
  const { settings } = useStoreSettings();
  return (
    <>
      {open && <button className="fixed inset-0 z-30 bg-gray-950/40 lg:hidden" aria-label="Close navigation" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform lg:sticky lg:top-16 lg:z-10 lg:h-[calc(100vh-4rem)] lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 lg:hidden">
          <span className="font-bold text-gray-900">{settings.storeName} Admin</span>
          <button type="button" onClick={onClose} aria-label="Close navigation" className="rounded-lg p-2 hover:bg-gray-100"><FiX /></button>
        </div>
        <div className="px-5 pb-3 pt-6 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">Workspace</div>
        <nav className="space-y-1 px-3" aria-label="Admin navigation">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive ? "bg-secondary text-primary" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto border-t border-gray-100 p-4">
          <div className="rounded-2xl bg-primary-dark p-4 text-white">
            <p className="text-sm font-bold">Storefront status</p>
            <p className="mt-1 text-xs text-white/70">Your store is online and ready for shoppers.</p>
            <span className="mt-3 inline-flex items-center gap-2 text-xs font-semibold"><span className="h-2 w-2 rounded-full bg-green-400" /> Online</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
