import { asyncHandler } from "../Utils/asyncHandler.utils.js";
import { ApiError } from "../Utils/Api_Error.utils.js";
import { ApiResponse } from "../Utils/Api_Response.utils.js";
import { Art } from "../models/art.model.js";
import { Share } from "../models/share.model.js";
import { random } from "../Utils/generator.utils.js";

const createShareLink = asyncHandler(async (req, res) => {
    const { artId } = req.params;

    // Check if the art piece exists
    const art = await Art.findById(artId);
    if (!art) {
        throw new ApiError(404, "Art piece not found");
    }

    // Generate a unique token
    const shareToken = random(8); // Generate an 8-character token

    // Create and save the new share link document
    await Share.create({
        shareToken,
        art: artId,
    });

    // Construct the full shareable URL to send back to the client
    const shareUrl = `${req.protocol}://${req.get('host')}/api/share/${shareToken}`;

    return res.status(201).json(new ApiResponse(201, { shareUrl }, "Share link created successfully!"));
});


// --- 2. Get the shared art content using the token ---
const getSharedContent = asyncHandler(async (req, res) => {
    const { shareToken } = req.params;

    if (!shareToken) {
        throw new ApiError(400, "Share token is required");
    }

    // Find the share document using the token
    const shareLink = await Share.findOne({ shareToken });

    if (!shareLink) {
        throw new ApiError(404, "Share link not found or has expired");
    }

    // Use the art ID from the share document to fetch the full art details
    const art = await Art.findById(shareLink.art).populate("artist", "userName avatar");

    if (!art) {
        throw new ApiError(404, "The shared art piece no longer exists");
    }

    return res.status(200).json(new ApiResponse(200, art, "Shared content retrieved successfully!"));
});

export { createShareLink, getSharedContent };