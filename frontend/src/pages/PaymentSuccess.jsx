import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { FiCheckCircle } from "react-icons/fi";
import Loader from "../components/common/Loader.jsx";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const orderId = params.get("orderId");
  const isCod = params.get("cod") === "true";
  const { clearCart } = useCart();
  const [status, setStatus] = useState("checking");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const confirmOrder = async () => {
      if (!orderId) {
        setError("The order reference is missing. Check your order history for its status.");
        setStatus("error");
        return;
      }

      try {
        if (isCod) {
          const { data } = await api.get(`/orders/${orderId}`);
          if (data.paymentMethod !== "cod") {
            throw new Error("This order was not placed with cash on delivery.");
          }
        } else {
          await api.post("/payment/esewa/verify", { orderId });
        }

        if (active) {
          await clearCart();
          setStatus("success");
        }
      } catch (err) {
        if (active) {
          console.error(err);
          setError(
            err.response?.data?.message ||
              err.message ||
              "We couldn't confirm this payment. Check your order history before trying again."
          );
          setStatus("error");
        }
      }
    };

    confirmOrder();
    return () => {
      active = false;
    };
  }, [clearCart, isCod, orderId]);

  if (status === "checking") return <Loader fullScreen />;

  if (status === "error") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="mb-3 text-3xl font-bold">We couldn’t confirm your order</h1>
        <p className="mb-8 text-gray-600">{error}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/orders" className="btn-primary">Check My Orders</Link>
          <Link to="/products" className="btn-outline">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <FiCheckCircle className="text-7xl text-green-500 mx-auto mb-6" />
      <h1 className="text-3xl font-bold mb-3">
        {isCod ? "Order Placed!" : "Payment Successful!"}
      </h1>
      <p className="text-gray-600 mb-2">
        {isCod
          ? "Your order has been placed. Pay cash upon delivery."
          : "Thank you! Your payment has been received."}
      </p>
      {orderId && (
        <p className="text-sm text-gray-500 mb-8">
          Order ID: <span className="font-mono font-medium">#{orderId.slice(-10).toUpperCase()}</span>
        </p>
      )}

      <div className="flex gap-4 justify-center flex-wrap mt-8">
        <Link to="/orders" className="btn-primary">View My Orders</Link>
        <Link to="/products" className="btn-outline">Continue Shopping</Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
