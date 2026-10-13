import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

const getStoredUser = () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    return storedUser && typeof storedUser === "object" ? storedUser : null;
  } catch {
    localStorage.removeItem("userInfo");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get("/auth/profile");
        setUser(data);
        localStorage.setItem("userInfo", JSON.stringify(data));
      } catch {
        setUser(null);
        localStorage.removeItem("userInfo");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setUser(data);
    localStorage.setItem("userInfo", JSON.stringify(data));
    toast.success(`Welcome back, ${data.name}!`);
    return data;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    setUser(data);
    localStorage.setItem("userInfo", JSON.stringify(data));
    toast.success("Account created successfully!");
    return data;
  };

  const logout = async ({ notify = true } = {}) => {
    try {
      await api.post("/auth/logout");
      if (notify) toast.success("Logged out");
    } catch (err) {
      console.error(err);
      if (notify) {
        toast.error("Your session was cleared locally, but the server could not confirm logout.");
      }
    } finally {
      setUser(null);
      localStorage.removeItem("userInfo");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
