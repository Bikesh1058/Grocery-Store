import { FiMenu, FiLogOut, FiExternalLink } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useStoreSettings } from "../../context/StoreSettingsContext";

const AdminNavbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { settings } = useStoreSettings();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
          aria-label="Open admin navigation"
        >
          <FiMenu size={20} />
        </button>
        <Link to="/admin" className="flex items-center gap-2 font-bold text-gray-900">
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt="" className="h-8 w-8 rounded-lg object-contain" />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-lg">🥬</span>
          )}
          <span className="hidden sm:inline">{settings.storeName} <span className="font-medium text-gray-400">/ Admin</span></span>
          <span className="sm:hidden">Admin</span>
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/" className="hidden items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary sm:flex">
          View store <FiExternalLink />
        </Link>
        <span className="hidden text-sm font-medium text-gray-700 sm:inline">{user?.name}</span>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
        >
          <FiLogOut />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
