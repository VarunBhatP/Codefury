import { asyncHandler } from "../Utils/asyncHandler.utils.js";
import { ApiError } from "../Utils/Api_Error.utils.js";
import { ApiResponse } from "../Utils/Api_Response.utils.js";
import { Art } from "../models/art.model.js";
import { Order } from "../models/order.model.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// --- Create a Stripe Payment Intent ---
const createStripePaymentIntent = asyncHandler(async (req, res) => {
    const { artId } = req.body;
    
    if (!artId) {
        throw new ApiError(400, "Art ID is required");
    }

    const art = await Art.findById(artId);
    if (!art || !art.isForSale) {
        throw new ApiError(404, "Art not found or is not for sale");
    }
    
    // Amount in the smallest currency unit (e.g., paise for INR)
    const amount = Math.round(art.price * 100); 

    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "inr",
        automatic_payment_methods: {
            enabled: true,
        },
    });

    // Create a pending order in our database
    await Order.create({
        user: req.user._id,
        items: [{ art: art._id, priceAtPurchase: art.price }],
        totalAmount: art.price,
        stripePaymentIntentId: paymentIntent.id,
    });

    return res.status(200).json(new ApiResponse(200, {
        clientSecret: paymentIntent.client_secret
    }, "Payment Intent created successfully"));
});


// --- Handle Stripe Webhook Events ---
const handleStripeWebhook = asyncHandler(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.log(`❌ Error message: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log(`✅ PaymentIntent for ${paymentIntent.amount} was successful!`);
            
            // Find the corresponding order and update its status
            await Order.findOneAndUpdate(
                { stripePaymentIntentId: paymentIntent.id },
                { $set: { paymentStatus: "completed" } }
            );
            break;
            
        case 'payment_intent.payment_failed':
            const failedPaymentIntent = event.data.object;
            console.log(`❌ PaymentIntent for ${failedPaymentIntent.amount} failed.`);

            await Order.findOneAndUpdate(
                { stripePaymentIntentId: failedPaymentIntent.id },
                { $set: { paymentStatus: "failed" } }
            );
            break;
            
        default:
            console.log(`Unhandled event type ${event.type}.`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
});

export { createStripePaymentIntent, handleStripeWebhook };