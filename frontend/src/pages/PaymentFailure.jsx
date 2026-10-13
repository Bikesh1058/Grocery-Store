import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiXCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../services/api";
import { submitEsewaPayment } from "../services/esewa";

const PaymentFailure = () => {
  const [params] = useSearchParams();
  const orderId = params.get("orderId");
  const [retrying, setRetrying] = useState(false);

  const retryPayment = async () => {
    if (!orderId) {
      toast.error("The order reference is missing.");
      return;
    }

    setRetrying(true);
    try {
      const { data } = await api.post("/payment/esewa/initiate", { orderId });
      submitEsewaPayment(data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Could not restart eSewa payment.");
      setRetrying(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <FiXCircle className="text-7xl text-danger mx-auto mb-6" />
      <h1 className="text-3xl font-bold mb-3">Payment Failed</h1>
      <p className="text-gray-600 mb-2">
        Unfortunately, your payment could not be processed.
      </p>
      {orderId && (
        <p className="text-sm text-gray-500 mb-8">
          Order ID: <span className="font-mono font-medium">#{orderId.slice(-10).toUpperCase()}</span>
        </p>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {orderId && (
          <button type="button" onClick={retryPayment} disabled={retrying} className="btn-primary">
            {retrying ? "Starting payment..." : "Retry eSewa payment"}
          </button>
        )}
        <Link to="/orders" className="btn-outline">View My Orders</Link>
      </div>
    </div>
  );
};

export default PaymentFailure;