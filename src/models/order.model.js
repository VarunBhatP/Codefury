import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                art: {
                    type: Schema.Types.ObjectId,
                    ref: "Art",
                    required: true,
                },
                priceAtPurchase: {
                    type: Number,
                    required: true,
                },
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending",
        },
        stripePaymentIntentId: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Order = mongoose.model("Order", orderSchema);