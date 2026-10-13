import { useState } from "react";
import toast from "react-hot-toast";
import { FiSave } from "react-icons/fi";
import Message from "../../components/common/Message.jsx";
import { useStoreSettings } from "../../context/StoreSettingsContext";

const fields = [
  ["storeName", "Store name"],
  ["tagline", "Tagline"],
  ["announcementText", "Announcement bar"],
  ["logoUrl", "Logo image URL"],
  ["faviconUrl", "Favicon image URL"],
  ["heroImageUrl", "Homepage hero image URL"],
  ["supportEmail", "Support email"],
  ["supportPhone", "Support phone"],
  ["address", "Store address"],
  ["currencySymbol", "Currency symbol"],
  ["shippingFee", "Standard delivery fee"],
  ["freeShippingThreshold", "Free delivery minimum"],
];

const AdminSettings = () => {
  const { settings, saveSettings } = useStoreSettings();
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await saveSettings({
        ...settings,
        ...form,
        shippingFee: Number(form.shippingFee ?? settings.shippingFee),
        freeShippingThreshold: Number(form.freeShippingThreshold ?? settings.freeShippingThreshold),
      });
      toast.success("Store settings saved.");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Could not save store settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">Store configuration</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900">Store settings</h1>
        <p className="mt-1 text-sm text-gray-500">Update the branding, contact details, and delivery options customers see.</p>
      </div>
      <Message variant="info">Changes are saved to the backend and reflected in the storefront. Use publicly accessible image URLs for logos and images.</Message>
      <form onSubmit={handleSubmit} className="card space-y-6 p-5 sm:p-7">
        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map(([name, label]) => (
            <label key={name} className={`block ${["announcementText", "logoUrl", "faviconUrl", "heroImageUrl", "address"].includes(name) ? "sm:col-span-2" : ""}`}>
              <span className="mb-1.5 block text-sm font-semibold text-gray-700">{label}</span>
              <input
                name={name}
                type={["shippingFee", "freeShippingThreshold"].includes(name) ? "number" : name === "supportEmail" ? "email" : "text"}
                min={["shippingFee", "freeShippingThreshold"].includes(name) ? "0" : undefined}
                step={["shippingFee", "freeShippingThreshold"].includes(name) ? "1" : undefined}
                value={form[name] ?? settings[name] ?? ""}
                onChange={updateField}
                required={name === "storeName"}
                maxLength={name.includes("Url") || name === "heroImageUrl" ? 2048 : 200}
                className="input-field"
              />
            </label>
          ))}
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-gray-700">Brand color</span>
            <span className="flex h-[50px] items-center gap-3 rounded-xl border border-gray-200 bg-white px-3">
              <input type="color" name="primaryColor" value={form.primaryColor ?? settings.primaryColor} onChange={updateField} className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent p-0" />
              <span className="font-mono text-sm text-gray-600">{form.primaryColor ?? settings.primaryColor}</span>
            </span>
          </label>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-5">
          <div className="flex items-center gap-3">
            {(form.logoUrl ?? settings.logoUrl) ? <img src={form.logoUrl ?? settings.logoUrl} alt="Store logo preview" className="h-12 w-12 rounded-xl border border-gray-100 object-contain" /> : <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-2xl">🥬</span>}
            <div><p className="text-sm font-bold text-gray-800">{form.storeName ?? settings.storeName}</p><p className="text-xs text-gray-500">Logo preview</p></div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary">
            <FiSave /> {saving ? "Saving..." : "Save settings"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
