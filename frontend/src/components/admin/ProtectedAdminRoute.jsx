import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../common/Loader.jsx";

const ProtectedAdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader fullScreen />;
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return children;
};

export default ProtectedAdminRoute;
