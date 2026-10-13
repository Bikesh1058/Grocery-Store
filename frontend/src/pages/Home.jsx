import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ProductGrid from "../components/product/ProductGrid.jsx";
import Loader from "../components/common/Loader.jsx";
import { FiArrowRight, FiShield, FiTruck, FiRefreshCw } from "react-icons/fi";
import { useStoreSettings } from "../context/StoreSettingsContext";

const categories = [
  { name: "Fruits", icon: "🍎" },
  { name: "Vegetables", icon: "🥬" },
  { name: "Dairy", icon: "🥛" },
  { name: "Bakery", icon: "🥖" },
  { name: "Beverages", icon: "🥤" },
  { name: "Snacks", icon: "🍫" },
  { name: "Meat", icon: "🍗" },
  { name: "Grains", icon: "🌾" },
];

const Home = () => {
  const { settings } = useStoreSettings();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsError, setProductsError] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get("/products?pageSize=8");
        if (!Array.isArray(data?.products)) {
          throw new Error("Product service returned an invalid response");
        }
        setFeatured(data.products);
      } catch (err) {
        console.error(err);
        setProductsError(true);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="pb-2">
      <section className="relative isolate overflow-hidden bg-[#f0f5ed]">
        <div className="absolute -right-28 -top-32 -z-10 h-96 w-96 rounded-full bg-[#dcebdd] blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 md:grid-cols-[1fr_0.95fr] md:py-20">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/80 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-primary shadow-sm">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Your neighborhood market, online
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-primary-dark sm:text-5xl lg:text-6xl">
              A fresher way
              <br />
              <span className="text-primary">to fill your table.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-gray-600 sm:text-lg">
              {settings.tagline} Shop farm-fresh produce and everyday favorites, carefully picked and delivered right to your door.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products" className="btn-primary px-6 py-3.5">
                Shop fresh <FiArrowRight />
              </Link>
              <Link to="/products?category=Vegetables" className="btn-outline px-6 py-3.5">
                Browse vegetables
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-gray-600">
              <span className="flex items-center gap-2"><FiTruck className="text-primary" /> Doorstep delivery</span>
              <span className="flex items-center gap-2"><FiShield className="text-primary" /> Secure checkout</span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-3 rotate-2 rounded-[2rem] bg-primary/10" />
            <img
              src={settings.heroImageUrl}
              alt="Colorful fresh produce at a market"
              className="relative h-72 w-full rounded-[1.75rem] object-cover shadow-xl sm:h-96"
            />
            <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3.5 shadow-lg sm:left-8">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-xl">🌿</span>
              <div>
                <p className="text-sm font-bold text-gray-900">Picked with care</p>
                <p className="text-xs text-gray-500">Freshness you can taste</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">Find your favorites</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">Shop by category</h2>
          </div>
          <Link to="/products" className="hidden items-center gap-1 text-sm font-bold text-primary transition hover:gap-2 sm:flex">
            All categories <FiArrowRight />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-8">
          {categories.map((c) => (
            <Link
              key={c.name}
              to={`/products?category=${c.name}`}
              className="group rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm transition duration-200 hover:-translate-y-1 hover:border-primary/20 hover:shadow-md"
            >
              <div className="mb-2 text-3xl transition duration-200 group-hover:scale-110 sm:text-4xl">{c.icon}</div>
              <p className="text-xs font-semibold text-gray-700 transition group-hover:text-primary sm:text-sm">{c.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">Fresh from our shelves</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">Customer favorites</h2>
          </div>
          <Link to="/products" className="inline-flex items-center gap-1 text-sm font-bold text-primary transition hover:gap-2">
            View all <FiArrowRight />
          </Link>
        </div>
        {loading ? (
          <Loader />
        ) : productsError ? (
          <p className="rounded-2xl border border-gray-100 bg-white px-6 py-10 text-center text-sm text-gray-600">
            We couldn’t load products right now. Please visit the shop again soon.
          </p>
        ) : featured.length === 0 ? (
          <p className="rounded-2xl border border-gray-100 bg-white px-6 py-10 text-center text-sm text-gray-600">
            We’re stocking the shelves. Check back soon for fresh picks.
          </p>
        ) : (
          <ProductGrid products={featured} />
        )}
      </section>

      <section className="border-y border-gray-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-gray-100 px-4 py-5 sm:px-6 md:grid-cols-3 md:divide-x md:divide-y-0 md:py-7">
          {[
            { icon: FiTruck, title: "Delivery made easy", desc: `Free on orders of ${settings.currencySymbol} ${settings.freeShippingThreshold} or more` },
            { icon: FiShield, title: "Checkout with confidence", desc: "Secure payments with eSewa" },
            { icon: FiRefreshCw, title: "Freshness comes first", desc: "Quality picks for your home" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-4 py-5 md:justify-center md:py-2">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-xl text-primary">
                <Icon />
              </span>
              <div>
                <h3 className="font-bold text-gray-900">{title}</h3>
                <p className="mt-1 text-sm text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
