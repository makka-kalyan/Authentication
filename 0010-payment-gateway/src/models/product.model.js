import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: {
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
  },
  stock: { type: Number, default: 0 },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
