import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import ProductGrid from "../components/product/ProductGrid.jsx";
import Loader from "../components/common/Loader.jsx";
import { FiSearch, FiArrowRight } from "react-icons/fi";

const categories = ["All", "Fruits", "Vegetables", "Dairy", "Bakery", "Beverages", "Snacks", "Meat", "Seafood", "Grains", "Other"];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [error, setError] = useState("");
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (keyword) params.set("keyword", keyword);
        if (category && category !== "All") params.set("category", category);
        params.set("page", page);
        params.set("pageSize", 12);
        const { data } = await api.get(`/products?${params}`);
        if (!Array.isArray(data?.products)) {
          throw new Error("Product service returned an invalid response");
        }
        setProducts(data.products);
        setPages(Number.isInteger(data.pages) && data.pages > 0 ? data.pages : 1);
      } catch (err) {
        console.error(err);
        setProducts([]);
        setPages(1);
        setError(err.response?.data?.message || "We couldn't load products right now. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [keyword, category, page, refreshIndex]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    const params = {};
    if (keyword) params.keyword = keyword;
    if (category !== "All") params.category = category;
    setSearchParams(params);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">The FreshCart selection</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Fresh picks for you</h1>
            <p className="mt-2 text-sm text-gray-500">Explore quality groceries for every day.</p>
          </div>
          <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-primary">Freshness, delivered</span>
        </div>
      </div>

      <form onSubmit={handleSearch} className="mb-5 flex flex-wrap gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
        <div className="relative min-w-[220px] flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search fruits, vegetables, pantry staples..."
            aria-label="Search products"
            className="input-field border-transparent bg-gray-50 pl-11 focus:border-primary"
          />
        </div>
        <button type="submit" className="btn-primary px-6">Search <FiArrowRight /></button>
      </form>

      <div className="mb-7 flex gap-2 overflow-x-auto pb-2" aria-label="Filter by category">
        {categories.map((c) => (
          <button
            type="button"
            key={c}
            onClick={() => { setCategory(c); setPage(1); }}
            aria-pressed={category === c}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${
              category === c
                ? "border-primary bg-primary text-white shadow-sm"
                : "border-gray-200 bg-white text-gray-600 hover:border-primary/30 hover:bg-secondary/50 hover:text-primary"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="rounded-2xl border border-red-100 bg-white px-6 py-16 text-center">
          <span className="text-4xl">🥬</span>
          <h2 className="mt-4 text-lg font-bold text-gray-900">We couldn’t load the shop</h2>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <button
            type="button"
            onClick={() => setRefreshIndex((index) => index + 1)}
            className="btn-primary mt-5 py-2.5"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          <ProductGrid products={products} />
          {products.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
              <span className="text-4xl">🥬</span>
              <h2 className="mt-4 text-lg font-bold text-gray-900">No products found</h2>
              <p className="mt-1 text-sm text-gray-500">Try a different search or category.</p>
              <button
                type="button"
                onClick={() => { setKeyword(""); setCategory("All"); setPage(1); setSearchParams({}); }}
                className="mt-5 text-sm font-bold text-primary hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}

          {pages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPage(p)}
                  aria-current={p === page ? "page" : undefined}
                  className={`h-10 w-10 rounded-xl border text-sm font-semibold transition ${
                    p === page ? "border-primary bg-primary text-white" : "border-gray-200 bg-white text-gray-700 hover:border-primary/30 hover:text-primary"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;