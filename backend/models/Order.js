import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    items: [
      {
        product: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: "Product", 
          required: true 
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        image: { type: String, required: true },
        unit: { type: String, default: "kg" }
      },
    ],
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: "" },
      zipCode: { type: String, default: "" },
      country: { type: String, default: "Nepal" },
    },
    paymentMethod: { 
      type: String, 
      required: true, 
      enum: ["esewa", "cod"] 
    },
    paymentResult: {
      transactionId: { type: String },
      status: { type: String },
      paidAt: { type: Date },
    },
    itemsPrice: { 
      type: Number, 
      required: true, 
      default: 0 
    },
    shippingPrice: { 
      type: Number, 
      required: true, 
      default: 0 
    },
    totalPrice: { 
      type: Number, 
      required: true, 
      default: 0 
    },
    isPaid: { 
      type: Boolean, 
      default: false 
    },
    paidAt: { 
      type: Date 
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
