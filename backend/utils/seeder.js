import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

dotenv.config();

// ---- Sample grocery products ----
const products = [
  // Fruits
  {
    name: "Fresh Red Apples",
    description: "Crisp and juicy Kashmiri apples, hand-picked for freshness.",
    price: 250,
    originalPrice: 320,
    category: "Fruits",
    image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600",
    stock: 120,
    unit: "kg",
    isOrganic: true,
  },
  {
    name: "Ripe Bananas",
    description: "Naturally ripened bananas, rich in potassium and perfect for smoothies.",
    price: 120,
    originalPrice: 150,
    category: "Fruits",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600",
    stock: 200,
    unit: "dozen",
    isOrganic: false,
  },
  {
    name: "Alphonso Mangoes",
    description: "Sweet, aromatic Alphonso mangoes imported from Maharashtra.",
    price: 480,
    originalPrice: 550,
    category: "Fruits",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600",
    stock: 60,
    unit: "kg",
    isOrganic: false,
  },

  // Vegetables
  {
    name: "Organic Tomatoes",
    description: "Vine-ripened organic tomatoes with a rich, tangy flavor.",
    price: 90,
    originalPrice: 110,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=600",
    stock: 150,
    unit: "kg",
    isOrganic: true,
  },
  {
    name: "Fresh Potatoes",
    description: "All-purpose potatoes, ideal for curries, fries, and roasting.",
    price: 70,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600",
    stock: 300,
    unit: "kg",
    isOrganic: false,
  },
  {
    name: "Green Spinach",
    description: "Tender organic spinach leaves, washed and ready to cook.",
    price: 60,
    originalPrice: 80,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600",
    stock: 100,
    unit: "bunch",
    isOrganic: true,
  },
  {
    name: "Red Onions",
    description: "Premium quality red onions, pungent and full of flavor.",
    price: 85,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?w=600",
    stock: 250,
    unit: "kg",
    isOrganic: false,
  },

  // Dairy
  {
    name: "Full Cream Milk",
    description: "Farm-fresh full cream milk, pasteurized and homogenized.",
    price: 95,
    category: "Dairy",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600",
    stock: 180,
    unit: "litre",
    isOrganic: false,
  },
  {
    name: "Greek Yogurt",
    description: "Thick, creamy Greek yogurt — high in protein, low in fat.",
    price: 220,
    originalPrice: 260,
    category: "Dairy",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600",
    stock: 80,
    unit: "500g",
    isOrganic: false,
  },
  {
    name: "Amul Butter",
    description: "Classic salted butter made from pure milk cream.",
    price: 280,
    category: "Dairy",
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600",
    stock: 90,
    unit: "500g",
    isOrganic: false,
  },

  // Bakery
  {
    name: "Whole Wheat Bread",
    description: "Freshly baked whole wheat bread with no preservatives.",
    price: 90,
    category: "Bakery",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600",
    stock: 70,
    unit: "loaf",
    isOrganic: false,
  },
  {
    name: "Butter Croissants",
    description: "Flaky, buttery croissants baked fresh every morning.",
    price: 160,
    originalPrice: 200,
    category: "Bakery",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600",
    stock: 40,
    unit: "4 pcs",
    isOrganic: false,
  },

  // Beverages
  {
    name: "Orange Juice",
    description: "100% pure, cold-pressed orange juice — no added sugar.",
    price: 180,
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600",
    stock: 110,
    unit: "1L",
    isOrganic: true,
  },
  {
    name: "Green Tea Bags",
    description: "Antioxidant-rich green tea, 25 premium tea bags per box.",
    price: 220,
    originalPrice: 280,
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=600",
    stock: 150,
    unit: "25 bags",
    isOrganic: true,
  },
  {
    name: "Arabica Coffee Beans",
    description: "Medium-roast Arabica beans with chocolatey, nutty notes.",
    price: 650,
    category: "Beverages",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600",
    stock: 60,
    unit: "500g",
    isOrganic: false,
  },

  // Snacks
  {
    name: "Roasted Almonds",
    description: "Lightly salted California almonds, dry-roasted to perfection.",
    price: 620,
    originalPrice: 750,
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600",
    stock: 100,
    unit: "500g",
    isOrganic: false,
  },
  {
    name: "Dark Chocolate Bar",
    description: "70% cocoa dark chocolate, rich and smooth.",
    price: 210,
    category: "Snacks",
    image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600",
    stock: 120,
    unit: "100g",
    isOrganic: false,
  },

  // Grains
  {
    name: "Basmati Rice",
    description: "Long-grain aged Basmati rice, aromatic and fluffy.",
    price: 340,
    category: "Grains",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600",
    stock: 200,
    unit: "5kg",
    isOrganic: false,
  },
  {
    name: "Whole Wheat Flour (Atta)",
    description: "Stone-ground whole wheat flour for soft, healthy chapatis.",
    price: 290,
    category: "Grains",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600",
    stock: 150,
    unit: "5kg",
    isOrganic: false,
  },

  // Meat & Seafood
  {
    name: "Chicken Breast",
    description: "Boneless, skinless chicken breast — fresh, never frozen.",
    price: 450,
    category: "Meat",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600",
    stock: 50,
    unit: "kg",
    isOrganic: false,
  },
  {
    name: "Fresh Salmon Fillet",
    description: "Wild-caught Norwegian salmon, rich in omega-3.",
    price: 1250,
    originalPrice: 1450,
    category: "Seafood",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600",
    stock: 30,
    unit: "kg",
    isOrganic: false,
  },
];

// ---- Sample admin user ----
const adminUser = {
  name: "Admin User",
  email: "admin@grocery.com",
  password: "admin123",
  phone: "9800000000",
  address: {
    street: "Durbar Marg",
    city: "Kathmandu",
    state: "Bagmati",
    zipCode: "44600",
    country: "Nepal",
  },
  role: "admin",
};

// ---- Import data ----
const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Order.deleteMany();
    await Cart.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Insert admin (password auto-hashed by pre-save hook)
    const createdAdmin = await User.create(adminUser);
    console.log(`✅ Admin created: ${createdAdmin.email} / admin123`);

    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ ${createdProducts.length} products inserted`);

    console.log("🎉 Data import complete!");
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

// ---- Safely add sample products without changing existing records ----
const importProductsOnly = async () => {
  try {
    await connectDB();

    const result = await Product.bulkWrite(
      products.map((product) => ({
        updateOne: {
          filter: { name: product.name },
          update: { $setOnInsert: product },
          upsert: true,
        },
      })),
      { ordered: false }
    );

    console.log(
      `✅ ${result.upsertedCount} sample products added; existing products were left unchanged`
    );
  } catch (error) {
    console.error(`❌ Error adding sample products: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

// ---- Destroy data ----
const destroyData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Cart.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log("🔥 All data destroyed");
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

// ---- CLI handling ----
if (process.argv[2] === "-d") {
  destroyData();
} else if (process.argv[2] === "--products-only") {
  importProductsOnly();
} else {
  importData();
}