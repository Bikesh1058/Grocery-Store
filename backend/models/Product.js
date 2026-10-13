import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    price: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    originalPrice: { 
      type: Number, 
      min: 0 
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Fruits", 
        "Vegetables", 
        "Dairy", 
        "Bakery", 
        "Beverages", 
        "Snacks", 
        "Meat", 
        "Seafood", 
        "Grains", 
        "Other"
      ],
    },
    image: { 
      type: String, 
      required: true 
    },
    stock: { 
      type: Number, 
      required: true, 
      default: 0, 
      min: 0 
    },
    unit: { 
      type: String, 
      default: "kg" 
    },
    ratings: { 
      type: Number, 
      default: 0 
    },
    numReviews: { 
      type: Number, 
      default: 0 
    },
    isOrganic: { 
      type: Boolean, 
      default: false 
    },
  },
  { timestamps: true }
);

// Create text index for search functionality
productSchema.index({ name: "text", description: "text" });
// Create index for category filtering
productSchema.index({ category: 1 });

const Product = mongoose.model("Product", productSchema);
export default Product;