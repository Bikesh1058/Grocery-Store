import { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "CART_LOADING":
      return { ...state, loading: true };
    case "CART_SET":
      return { items: action.payload, loading: false };
    case "CART_ERROR":
      return { ...state, loading: false };
    case "CART_CLEAR":
      return { items: [], loading: false };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, { items: [], loading: false });

  useEffect(() => {
    const fetchCart = async () => {
      if (authLoading) return;
      if (!user) {
        dispatch({ type: "CART_CLEAR" });
        return;
      }
      dispatch({ type: "CART_LOADING" });
      try {
        const { data } = await api.get("/cart");
        dispatch({ type: "CART_SET", payload: data.items || [] });
      } catch (err) {
        console.error(err);
        dispatch({ type: "CART_ERROR" });
      }
    };
    fetchCart();
  }, [user, authLoading]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      toast.error("Please login to add items");
      return false;
    }
    try {
      const { data } = await api.post("/cart/add", { productId, quantity });
      dispatch({ type: "CART_SET", payload: data.items });
      toast.success("Added to cart");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add");
      return false;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const { data } = await api.put("/cart/update", { productId, quantity });
      dispatch({ type: "CART_SET", payload: data.items });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const { data } = await api.delete(`/cart/remove/${productId}`);
      dispatch({ type: "CART_SET", payload: data.items });
      toast.success("Removed from cart");
    } catch {
      toast.error("Failed to remove");
    }
  };

  const clearCart = useCallback(async () => {
    dispatch({ type: "CART_CLEAR" });
    try {
      await api.delete("/cart/clear");
    } catch (err) {
      console.error(err);
      toast.error("Your local cart was cleared, but the server could not sync it.");
    }
  }, []);

  const totalItems = state.items.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice = state.items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ ...state, addToCart, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);
