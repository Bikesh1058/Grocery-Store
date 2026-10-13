import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiEdit2, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import Loader from "../../components/common/Loader.jsx";
import Message from "../../components/common/Message.jsx";
import api from "../../services/api";
import { useStoreSettings } from "../../context/StoreSettingsContext";

const emptyProduct = {
  name: "",
  description: "",
  price: "",
  originalPrice: "",
  category: "Fruits",
  image: "",
  stock: "",
  unit: "kg",
  isOrganic: false,
};
const categories = ["Fruits", "Vegetables", "Dairy", "Bakery", "Beverages", "Snacks", "Meat", "Seafood", "Grains", "Other"];

const requestProducts = async () => {
  const { data } = await api.get("/products?pageSize=1000");
  if (!Array.isArray(data.products)) throw new Error("Invalid product response");
  return data.products;
};

const AdminProducts = () => {
  const { settings } = useStoreSettings();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [editor, setEditor] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      setProducts(await requestProducts());
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || "Could not load products.";
      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    requestProducts()
      .then(setProducts)
      .catch((error) => {
        console.error(error);
        const message = error.response?.data?.message || "Could not load products.";
        setLoadError(message);
        toast.error(message);
      })
      .finally(() => setLoading(false));
  }, []);

  const startEdit = (product) => setEditor({ ...product });
  const startCreate = () => setEditor({ ...emptyProduct });
  const closeEditor = () => setEditor(null);

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      ...editor,
      price: Number(editor.price),
      originalPrice: Number(editor.originalPrice || editor.price),
      stock: Number(editor.stock),
    };
    try {
      if (editor._id) await api.put(`/products/${editor._id}`, payload);
      else await api.post("/products", payload);
      toast.success(editor._id ? "Product updated." : "Product created.");
      closeEditor();
      await loadProducts();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Could not save the product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}" from the catalog?`)) return;
    try {
      await api.delete(`/products/${product._id}`);
      toast.success("Product deleted.");
      setProducts((current) => current.filter((item) => item._id !== product._id));
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Could not delete the product.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">Catalog</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">Add products, update prices and stock, and keep your catalog fresh.</p>
        </div>
        <button type="button" onClick={startCreate} className="btn-primary"><FiPlus /> Add product</button>
      </div>

      {loadError && (
        <Message variant="error">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>{loadError}</span>
            <button type="button" onClick={loadProducts} className="font-bold underline">Try again</button>
          </div>
        </Message>
      )}

      <div className="card overflow-hidden">
        {loading ? <Loader /> : loadError ? null : products.length === 0 ? (
          <p className="px-6 py-14 text-center text-sm text-gray-500">No products yet. Add your first product to get started.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr><th className="px-5 py-3">Product</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Price</th><th className="px-5 py-3">Stock</th><th className="px-5 py-3 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50/70">
                    <td className="px-5 py-3"><div className="flex items-center gap-3"><img src={product.image} alt="" className="h-11 w-11 rounded-lg bg-gray-100 object-cover" /><span className="font-semibold text-gray-800">{product.name}</span></div></td>
                    <td className="px-5 py-3 text-gray-600">{product.category}</td>
                    <td className="px-5 py-3 font-semibold text-gray-800">{settings.currencySymbol} {Number(product.price).toLocaleString()}</td>
                    <td className="px-5 py-3"><span className={product.stock <= 5 ? "font-bold text-red-600" : "text-gray-600"}>{product.stock} {product.unit}</span></td>
                    <td className="px-5 py-3"><div className="flex justify-end gap-2"><button type="button" aria-label={`Edit ${product.name}`} onClick={() => startEdit(product)} className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100"><FiEdit2 /></button><button type="button" aria-label={`Delete ${product.name}`} onClick={() => handleDelete(product)} className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50"><FiTrash2 /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-950/40 p-4">
          <form onSubmit={handleSave} className="my-auto w-full max-w-2xl space-y-4 rounded-2xl bg-white p-5 shadow-xl sm:p-7">
            <div className="flex items-center justify-between"><h2 className="text-xl font-bold">{editor._id ? "Edit product" : "Add product"}</h2><button type="button" onClick={closeEditor} aria-label="Close product form" className="rounded-lg p-2 hover:bg-gray-100"><FiX /></button></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2"><span className="mb-1 block text-sm font-semibold">Product name</span><input className="input-field" required value={editor.name} onChange={(event) => setEditor({ ...editor, name: event.target.value })} /></label>
              <label className="block sm:col-span-2"><span className="mb-1 block text-sm font-semibold">Description</span><textarea className="input-field min-h-24" required value={editor.description} onChange={(event) => setEditor({ ...editor, description: event.target.value })} /></label>
              <label className="block"><span className="mb-1 block text-sm font-semibold">Category</span><select className="input-field" value={editor.category} onChange={(event) => setEditor({ ...editor, category: event.target.value })}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
              <label className="block"><span className="mb-1 block text-sm font-semibold">Unit</span><input className="input-field" required value={editor.unit} onChange={(event) => setEditor({ ...editor, unit: event.target.value })} /></label>
              <label className="block"><span className="mb-1 block text-sm font-semibold">Price</span><input className="input-field" type="number" min="0" step="0.01" required value={editor.price} onChange={(event) => setEditor({ ...editor, price: event.target.value })} /></label>
              <label className="block"><span className="mb-1 block text-sm font-semibold">Original price</span><input className="input-field" type="number" min="0" step="0.01" value={editor.originalPrice ?? ""} onChange={(event) => setEditor({ ...editor, originalPrice: event.target.value })} /></label>
              <label className="block"><span className="mb-1 block text-sm font-semibold">Stock</span><input className="input-field" type="number" min="0" step="1" required value={editor.stock} onChange={(event) => setEditor({ ...editor, stock: event.target.value })} /></label>
              <label className="block sm:col-span-2"><span className="mb-1 block text-sm font-semibold">Product image URL</span><input className="input-field" type="url" required value={editor.image} onChange={(event) => setEditor({ ...editor, image: event.target.value })} /></label>
              <label className="flex items-center gap-2 text-sm font-medium sm:col-span-2"><input type="checkbox" checked={Boolean(editor.isOrganic)} onChange={(event) => setEditor({ ...editor, isOrganic: event.target.checked })} /> Mark as organic</label>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4"><button type="button" onClick={closeEditor} className="btn-outline">Cancel</button><button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving..." : "Save product"}</button></div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
