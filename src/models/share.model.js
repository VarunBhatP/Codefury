import mongoose, { Schema } from "mongoose";

const shareSchema = new Schema({
    shareToken: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    art: {
        type: Schema.Types.ObjectId,
        ref: "Art",
        required: true,
    },
}, { timestamps: true });

export const Share = mongoose.model("Share", shareSchema);