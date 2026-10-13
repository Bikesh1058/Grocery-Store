import { Link } from "react-router-dom";
import { FiPlus, FiCheck } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useStoreSettings } from "../../context/StoreSettingsContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { settings } = useStoreSettings();

  const discount =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  return (
    <article className="card group flex flex-col overflow-hidden">
      <Link to={`/products/${product._id}`} className="relative block aspect-[4/3] overflow-hidden bg-secondary/50">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.isOrganic && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-primary shadow-sm backdrop-blur">
            Organic
          </span>
        )}
        {discount > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-danger px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            -{discount}%
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <Link to={`/products/${product._id}`}>
          <h3 className="truncate font-bold text-gray-800 transition group-hover:text-primary">{product.name}</h3>
        </Link>
        <p className="mt-1 text-sm text-gray-500">{product.unit}</p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-5">
          <div>
            <span className="text-lg font-extrabold tracking-tight text-primary">{settings.currencySymbol} {product.price}</span>
            {discount > 0 && (
              <span className="ml-2 text-xs text-gray-400 line-through">
                {settings.currencySymbol} {product.originalPrice}
              </span>
            )}
          </div>
          <button
            onClick={() => addToCart(product._id)}
            disabled={product.stock === 0}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary transition hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            title={product.stock === 0 ? "Out of stock" : "Add to cart"}
            aria-label={product.stock === 0 ? `${product.name} is out of stock` : `Add ${product.name} to cart`}
          >
            {product.stock === 0 ? <FiCheck /> : <FiPlus />}
          </button>
        </div>

        {product.stock === 0 && (
          <p className="mt-2 text-xs font-medium text-danger">Currently out of stock</p>
        )}
      </div>
    </article>
  );
};

export default ProductCard;