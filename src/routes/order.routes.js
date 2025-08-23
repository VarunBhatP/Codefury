import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createStripePaymentIntent, handleStripeWebhook } from "../controllers/order.controller.js";

const router = Router();

// Secure route to create a payment intent
router.route("/create-payment-intent").post(createStripePaymentIntent);

// Public route for Stripe to send webhook events to
router.route("/webhook").post(handleStripeWebhook);

export default router;