import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/common/Loader.jsx";
import { useCart } from "../context/CartContext";
import { FiMinus, FiPlus, FiArrowLeft } from "react-icons/fi";
import { useStoreSettings } from "../context/StoreSettingsContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { settings } = useStoreSettings();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch {
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  if (loading) return <Loader fullScreen />;
  if (!product) return null;

  const discount =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6"
      >
        <FiArrowLeft /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm">
          <img src={product.image} alt={product.name} className="w-full h-[500px] object-cover" />
          {product.isOrganic && (
            <span className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
              Organic
            </span>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-sm text-gray-500 mb-4">Category: {product.category}</p>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-primary">{settings.currencySymbol} {product.price}</span>
            {discount > 0 && (
              <>
                <span className="text-lg text-gray-400 line-through">{settings.currencySymbol} {product.originalPrice}</span>
                <span className="bg-danger text-white text-xs px-2 py-1 rounded">-{discount}%</span>
              </>
            )}
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Unit</span>
              <span className="font-medium">{product.unit}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Stock</span>
              <span className={`font-medium ${product.stock > 0 ? "text-green-600" : "text-danger"}`}>
                {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
              </span>
            </div>
          </div>

          {product.stock > 0 && (
            <>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="p-2 hover:bg-gray-100"
                  >
                    <FiMinus />
                  </button>
                  <span className="px-4 font-medium">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="p-2 hover:bg-gray-100"
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>

              <button
                onClick={() => addToCart(product._id, qty)}
                className="btn-primary w-full"
              >
                Add to Cart
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;