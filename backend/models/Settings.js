import mongoose from "mongoose";

export const defaultStoreSettings = {
  storeName: "FreshCart",
  tagline: "Good food, made easy.",
  announcementText: "Fresh picks, delivered across Nepal",
  logoUrl: "",
  faviconUrl: "",
  heroImageUrl:
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&auto=format&fit=crop&q=85",
  supportEmail: "",
  supportPhone: "",
  address: "Nepal",
  currencySymbol: "Rs.",
  shippingFee: 100,
  freeShippingThreshold: 1000,
  primaryColor: "#2f6b4f",
};

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "store", unique: true, immutable: true },
    ...Object.fromEntries(
      Object.entries(defaultStoreSettings).map(([field, defaultValue]) => [
        field,
        {
          type: typeof defaultValue === "number" ? Number : String,
          default: defaultValue,
          trim: typeof defaultValue === "string",
        },
      ])
    ),
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;