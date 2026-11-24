import express from "express";
import crypto from "crypto";

import productModel from "../models/product.model.js";
import razorpayInstance from "../config/razorpay.js";
import paymentModel from "../models/payment.model.js";
import config from "../config/config.js";

const router = express.Router();

// Create Razorpay Order
router.post("/:productId/order", async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const amount = product.price.amount * 100;

    if (!Number.isSafeInteger(amount) || amount <= 0) {
      return res.status(400).json({
        message: "Invalid product amount",
      });
    }

    const order = await razorpayInstance.orders.create({
      amount,
      currency: product.price.currency,
      receipt: `receipt_order_${productId}`,
      notes: {
        productId,
        productName: product.name,
        productDescription: product.description,
      },
    });

    const payment = await paymentModel.create({
      orderId: order.id,
      productId,
      amount: order.amount,
      currency: order.currency,
      status: "pending",
    });

    return res.status(201).json({
      ...payment.toObject(),
      keyId: razorpayInstance.key_id,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Payment order creation failed",
    });
  }
});

// Verify Razorpay Payment
router.post("/verify", async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({
        message: "Missing payment verification details",
      });
    }

    const payment = await paymentModel.findOne({
      orderId,
      status: "pending",
    });

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found or already verified",
      });
    }

    // Generate expected signature
    const expectedSignature = crypto
      .createHmac("sha256", config.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    // Compare signatures safely
    const isValid =
      /^[a-f0-9]{64}$/i.test(signature) &&
      crypto.timingSafeEqual(
        Buffer.from(expectedSignature, "hex"),
        Buffer.from(signature, "hex"),
      );

    if (!isValid) {
      return res.status(400).json({
        message: "Invalid payment verification signature",
      });
    }

    await paymentModel.updateOne(
      { orderId, status: "pending" },
      {
        $set: {
          paymentId,
          signature,
          status: "completed",
        },
      },
    );

    return res.status(200).json({
      status: "success",
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Payment verification failed",
    });
  }
});

export default router;
