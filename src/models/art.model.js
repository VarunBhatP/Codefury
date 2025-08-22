import mongoose, { Schema } from "mongoose";

const artSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    artForm: {
      type: String,
      enum: ["Warli", "Pithora", "Madhubani", "Other"],
      required: true,
    },

    images: [
      {
        type: String, // cloudinary URLs
        required: true,
      },
    ],

    price: {
      type: Number,
      default: 0, // if they want to sell, else can keep 0
    },

    isForSale: {
      type: Boolean,
      default: false,
    },

    artist: {
      type: Schema.Types.ObjectId,
      ref: "User", // linking to user.model.js
      required: true,
    },

    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User", // users who liked
      },
    ],

    comments: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Art = mongoose.model("Art", artSchema);
