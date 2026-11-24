import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Product from "../models/product.model.js";

const products = [
  {
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with adjustable DPI",
    price: { amount: 799, currency: "INR" },
    stock: 35,
  },
  {
    name: "Mechanical Keyboard",
    description: "Compact mechanical keyboard with tactile switches",
    price: { amount: 3499, currency: "INR" },
    stock: 20,
  },
  {
    name: "USB-C Hub",
    description: "Multi-port USB-C hub with HDMI and USB 3.0",
    price: { amount: 1899, currency: "INR" },
    stock: 28,
  },
  {
    name: "Bluetooth Headphones",
    description: "Over-ear Bluetooth headphones with noise isolation",
    price: { amount: 4999, currency: "INR" },
    stock: 16,
  },
  {
    name: "Laptop Stand",
    description: "Adjustable aluminum stand for laptops",
    price: { amount: 1299, currency: "INR" },
    stock: 42,
  },
  {
    name: "Webcam",
    description: "1080p webcam with built-in microphone",
    price: { amount: 2299, currency: "INR" },
    stock: 18,
  },
  {
    name: "Portable SSD",
    description: "500 GB portable solid-state drive",
    price: { amount: 5499, currency: "INR" },
    stock: 12,
  },
  {
    name: "Wireless Charger",
    description: "Fast wireless charging pad for compatible devices",
    price: { amount: 999, currency: "INR" },
    stock: 30,
  },
  {
    name: "USB-C Cable",
    description: "1.5 m braided USB-C charging and data cable",
    price: { amount: 399, currency: "INR" },
    stock: 60,
  },
  {
    name: "Laptop Backpack",
    description: "Water-resistant backpack with a padded laptop compartment",
    price: { amount: 2799, currency: "INR" },
    stock: 14,
  },
];

try {
  await connectDB();

  await Product.bulkWrite(
    products.map((product) => ({
      updateOne: {
        filter: { name: product.name },
        update: { $set: product },
        upsert: true,
      },
    })),
  );

  console.log(`Seeded ${products.length} sample products`);
} finally {
  await mongoose.disconnect();
}
