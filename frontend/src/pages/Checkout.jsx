import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useStoreSettings } from "../context/StoreSettingsContext";
import { submitEsewaPayment } from "../services/esewa";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { settings } = useStoreSettings();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("esewa");
  const [address, setAddress] = useState({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zipCode: user?.address?.zipCode || "",
    country: "Nepal",
  });

  const shippingPrice = totalPrice >= settings.freeShippingThreshold ? 0 : settings.shippingFee;
  const grandTotal = totalPrice + shippingPrice;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="mb-6 text-6xl">🛒</p>
        <h1 className="mb-2 text-2xl font-bold">Your cart is empty</h1>
        <p className="mb-8 text-gray-600">Add something fresh before heading to checkout.</p>
        <Link to="/products" className="btn-primary">Browse products</Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!items.length) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);
    let createdOrderId;
    try {
      // 1. Create order
      const { data: order } = await api.post("/orders", {
        items: items.map((i) => ({
          product: i.product,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
          unit: i.unit,
        })),
        shippingAddress: address,
        paymentMethod,
        itemsPrice: totalPrice,
        shippingPrice,
        totalPrice: grandTotal,
      });
      createdOrderId = order._id;

      // 2. Handle payment
      if (paymentMethod === "cod") {
        await clearCart();
        navigate(`/payment-success?orderId=${order._id}&cod=true`);
        return;
      }

      if (paymentMethod === "esewa") {
        const { data } = await api.post("/payment/esewa/initiate", {
          orderId: order._id,
        });
        submitEsewaPayment(data);
      }
    } catch (err) {
      if (createdOrderId && paymentMethod === "esewa") {
        toast.error(err.response?.data?.message || "Could not start eSewa payment. You can retry from the payment page.");
        await clearCart();
        navigate(`/payment-failure?orderId=${createdOrderId}`, { replace: true });
        return;
      }
      toast.error(err.response?.data?.message || "Failed to place order");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="grid md:grid-cols-3 gap-8">
        {/* Left side */}
        <div className="md:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Street address"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                className="input-field sm:col-span-2"
                required
              />
              <input
                type="text"
                placeholder="City"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="input-field"
                required
              />
              <input
                type="text"
                placeholder="State"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                className="input-field"
              />
              <input
                type="text"
                placeholder="Zip Code"
                value={address.zipCode}
                onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                className="input-field"
              />
              <input
                type="text"
                value={address.country}
                disabled
                className="input-field bg-gray-100"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <div className="space-y-3">
              {[
                { id: "esewa", label: "eSewa", desc: "Pay via eSewa wallet", color: "border-green-500 bg-green-50" },
                { id: "cod", label: "Cash on Delivery", desc: "Pay when you receive", color: "border-gray-400 bg-gray-50" },
              ].map((m) => (
                <label
                  key={m.id}
                  className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition ${
                    paymentMethod === m.id ? m.color : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={m.id}
                    checked={paymentMethod === m.id}
                    onChange={() => setPaymentMethod(m.id)}
                    className="accent-primary w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{m.label}</p>
                    <p className="text-xs text-gray-500">{m.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right side — Summary */}
        <div className="md:col-span-1">
          <div className="card p-6 sticky top-24">
            <h3 className="font-semibold text-lg mb-4">Order Summary</h3>

            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {items.map((i) => (
                <div key={i.product} className="flex gap-3 text-sm">
                  <img src={i.image} alt={i.name} className="w-12 h-12 rounded object-cover" />
                  <div className="flex-1">
                    <p className="font-medium truncate">{i.name}</p>
                    <p className="text-gray-500">x{i.quantity}</p>
                  </div>
                  <p className="font-medium">{settings.currencySymbol} {(i.price * i.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <hr className="my-4" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{settings.currencySymbol} {totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{shippingPrice === 0 ? "Free" : `${settings.currencySymbol} ${shippingPrice}`}</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">{settings.currencySymbol} {grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-6"
            >
              {loading
                ? "Processing..."
                : paymentMethod === "cod"
                ? "Place Order"
                : `Pay with ${paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
