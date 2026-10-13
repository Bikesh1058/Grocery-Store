import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import { useStoreSettings } from "../context/StoreSettingsContext";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();
  const { user } = useAuth();
  const { settings } = useStoreSettings();
  const navigate = useNavigate();

  const shipping = totalPrice >= settings.freeShippingThreshold || totalPrice === 0 ? 0 : settings.shippingFee;
  const grandTotal = totalPrice + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-6">🛒</p>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Add some products to get started</p>
        <Link to="/products" className="btn-primary inline-block">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart ({totalItems} items)</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product} className="card p-4 flex gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.unit}</p>
                <p className="text-primary font-bold mt-1">{settings.currencySymbol} {item.price}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeFromCart(item.product)}
                  className="text-danger hover:bg-red-50 p-2 rounded-lg transition"
                >
                  <FiTrash2 />
                </button>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.product, item.quantity - 1)}
                    className="p-1.5 hover:bg-gray-100"
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="px-3 font-medium text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product, item.quantity + 1)}
                    className="p-1.5 hover:bg-gray-100"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{settings.currencySymbol} {totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? "Free" : `${settings.currencySymbol} ${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-accent">
                  Add {settings.currencySymbol} {(settings.freeShippingThreshold - totalPrice).toFixed(2)} more for free shipping
                </p>
              )}
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">{settings.currencySymbol} {grandTotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => (user ? navigate("/checkout") : navigate("/login"))}
              className="btn-primary w-full mt-6"
            >
              {user ? "Proceed to Checkout" : "Login to Checkout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;