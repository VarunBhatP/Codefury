import { asyncHandler } from "../Utils/asyncHandler.utils.js";
import { ApiError } from "../Utils/Api_Error.utils.js";
import { ApiResponse } from "../Utils/Api_Response.utils.js";
import { Art } from "../models/art.model.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../Utils/cloudinary.file_uploading.util.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

// Create new art piece
const createArt = asyncHandler(async (req, res) => {
    const { title, description, artForm, price, isForSale, tags } = req.body;

    // Validate required fields
    if (!title || !description || !artForm) {
        throw new ApiError(400, "Title, description, and art form are required!");
    }

    // Validate art form
    const validArtForms = ["Warli", "Pithora", "Madhubani", "Other"];
    if (!validArtForms.includes(artForm)) {
        throw new ApiError(400, "Invalid art form. Must be one of: Warli, Pithora, Madhubani, Other");
    }

    // Check if images are uploaded
    if (!req.files || !req.files.images || req.files.images.length === 0) {
        throw new ApiError(400, "At least one image is required!");
    }

    // Upload images to Cloudinary
    const imageUrls = [];
    for (const file of req.files.images) {
        const uploadedImage = await uploadOnCloudinary(file.path);
        if (!uploadedImage) {
            throw new ApiError(400, "Failed to upload image to Cloudinary");
        }
        imageUrls.push(uploadedImage.url);
    }

    // Create art piece
    const art = await Art.create({
        title,
        description,
        artForm,
        images: imageUrls,
        price: price || 0,
        isForSale: isForSale || false,
        artist: req.user._id,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });

    // Populate artist details
    const populatedArt = await Art.findById(art._id).populate("artist", "userName avatar");

    return res.status(201).json(
        new ApiResponse(201, populatedArt, "Art piece created successfully!")
    );
});

// Get all art pieces with pagination and filters
const getAllArt = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, artForm, isForSale, search, sortBy = "createdAt", sortOrder = "desc" } = req.query;

    // Build filter object
    const filter = {};
    if (artForm) filter.artForm = artForm;
    if (isForSale !== undefined) filter.isForSale = isForSale === "true";
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { tags: { $in: [new RegExp(search, "i")] } }
        ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with pagination
    const arts = await Art.find(filter)
        .populate("artist", "userName avatar")
        .populate("likes", "userName avatar")
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Art.countDocuments(filter);

    return res.status(200).json(
        new ApiResponse(200, {
            arts,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        }, "Art pieces retrieved successfully!")
    );
});

// Get art piece by ID
const getArtById = asyncHandler(async (req, res) => {
    const { artId } = req.params;

    console.log(`Art id: ${artId}`);
    

    if (!mongoose.Types.ObjectId.isValid(artId)) {
        throw new ApiError(400, "Invalid art ID");
    }

    const art = await Art.findById(artId)
        .populate("artist", "userName avatar")
        .populate("likes", "userName avatar")
        .populate("comments.user", "userName avatar");

    if (!art) {
        throw new ApiError(404, "Art piece not found");
    }

    return res.status(200).json(
        new ApiResponse(200, art, "Art piece retrieved successfully!")
    );
});

// Update art piece
const updateArt = asyncHandler(async (req, res) => {
    const { artId } = req.params;
    const { title, description, artForm, price, isForSale, tags } = req.body;

    if (!mongoose.Types.ObjectId.isValid(artId)) {
        throw new ApiError(400, "Invalid art ID");
    }

    // Find art piece and check ownership
    const art = await Art.findById(artId);
    if (!art) {
        throw new ApiError(404, "Art piece not found");
    }

    if (art.artist.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only update your own art pieces");
    }

    // Validate art form if provided
    if (artForm) {
        const validArtForms = ["Warli", "Pithora", "Madhubani", "Other"];
        if (!validArtForms.includes(artForm)) {
            throw new ApiError(400, "Invalid art form. Must be one of: Warli, Pithora, Madhubani, Other");
        }
    }

    // Handle new images if uploaded
    let imageUrls = art.images;
    if (req.files && req.files.images && req.files.images.length > 0) {
        // Upload new images
        for (const file of req.files.images) {
            const uploadedImage = await uploadOnCloudinary(file.path);
            if (!uploadedImage) {
                throw new ApiError(400, "Failed to upload image to Cloudinary");
            }
            imageUrls.push(uploadedImage.url);
        }
    }

    // Update art piece
    const updatedArt = await Art.findByIdAndUpdate(
        artId,
        {
            $set: {
                title: title || art.title,
                description: description || art.description,
                artForm: artForm || art.artForm,
                price: price !== undefined ? price : art.price,
                isForSale: isForSale !== undefined ? isForSale : art.isForSale,
                images: imageUrls,
                tags: tags ? tags.split(',').map(tag => tag.trim()) : art.tags
            }
        },
        { new: true }
    ).populate("artist", "userName avatar");

    return res.status(200).json(
        new ApiResponse(200, updatedArt, "Art piece updated successfully!")
    );
});

// Delete art piece
const deleteArt = asyncHandler(async (req, res) => {
    const { artId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(artId)) {
        throw new ApiError(400, "Invalid art ID");
    }

    // Find art piece and check ownership
    const art = await Art.findById(artId);
    if (!art) {
        throw new ApiError(404, "Art piece not found");
    }

    if (art.artist.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only delete your own art pieces");
    }

    // Delete images from Cloudinary
    for (const imageUrl of art.images) {
        const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];
        await cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
                console.error("Error deleting image from Cloudinary:", error);
            } else {
                console.log("Image deleted from Cloudinary:", result);
            }
        });
    }

    // Delete art piece
    await Art.findByIdAndDelete(artId);

    return res.status(200).json(
        new ApiResponse(200, {}, "Art piece deleted successfully!")
    );
});

// Like/Unlike art piece
const toggleLike = asyncHandler(async (req, res) => {
    const { artId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(artId)) {
        throw new ApiError(400, "Invalid art ID");
    }

    const art = await Art.findById(artId);
    if (!art) {
        throw new ApiError(404, "Art piece not found");
    }

    const userId = req.user._id;
    const isLiked = art.likes.includes(userId);

    let updatedArt;
    if (isLiked) {
        // Unlike
        updatedArt = await Art.findByIdAndUpdate(
            artId,
            { $pull: { likes: userId } },
            { new: true }
        ).populate("artist", "userName avatar");
    } else {
        // Like
        updatedArt = await Art.findByIdAndUpdate(
            artId,
            { $addToSet: { likes: userId } },
            { new: true }
        ).populate("artist", "userName avatar");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedArt, isLiked ? "Art piece unliked!" : "Art piece liked!")
    );
});

// Add comment to art piece
const addComment = asyncHandler(async (req, res) => {
    const { artId } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === "") {
        throw new ApiError(400, "Comment text is required!");
    }

    if (!mongoose.Types.ObjectId.isValid(artId)) {
        throw new ApiError(400, "Invalid art ID");
    }

    const art = await Art.findById(artId);
    if (!art) {
        throw new ApiError(404, "Art piece not found");
    }

    const comment = {
        user: req.user._id,
        text: text.trim()
    };

    const updatedArt = await Art.findByIdAndUpdate(
        artId,
        { $push: { comments: comment } },
        { new: true }
    )
    .populate("artist", "userName avatar")
    .populate("comments.user", "userName avatar");

    return res.status(200).json(
        new ApiResponse(200, updatedArt, "Comment added successfully!")
    );
});

// Remove comment from art piece
const removeComment = asyncHandler(async (req, res) => {
    const { artId, commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(artId)) {
        throw new ApiError(400, "Invalid art ID");
    }

    const art = await Art.findById(artId);
    if (!art) {
        throw new ApiError(404, "Art piece not found");
    }

    // Find the comment and check ownership
    const comment = art.comments.id(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (comment.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only delete your own comments");
    }

    // Remove the comment
    comment.deleteOne();

    await art.save();

    const updatedArt = await Art.findById(artId)
        .populate("artist", "userName avatar")
        .populate("comments.user", "userName avatar");

    return res.status(200).json(
        new ApiResponse(200, updatedArt, "Comment removed successfully!")
    );
});

// Get art pieces by artist
const getArtByArtist = asyncHandler(async (req, res) => {
    const { artistId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(artistId)) {
        throw new ApiError(400, "Invalid artist ID");
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const arts = await Art.find({ artist: artistId })
        .populate("artist", "userName avatar")
        .populate("likes", "userName avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Art.countDocuments({ artist: artistId });

    return res.status(200).json(
        new ApiResponse(200, {
            arts,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        }, "Artist's art pieces retrieved successfully!")
    );
});

// Get user's liked art pieces
const getLikedArt = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    console.log("get liked called...");
    
    const arts = await Art.find({ likes: req.user._id })
        .populate("artist", "userName avatar")
        .populate("likes", "userName avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Art.countDocuments({ likes: req.user._id });

    return res.status(200).json(
        new ApiResponse(200, {
            arts,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        }, "Liked art pieces retrieved successfully!")
    );
});

// Get trending art pieces (most liked)
const getTrendingArt = asyncHandler(async (req, res) => {
    const { limit = 10 } = req.query;

    const arts = await Art.aggregate([
        {
            $addFields: {
                likeCount: { $size: "$likes" }
            }
        },
        {
            $sort: { likeCount: -1, createdAt: -1 }
        },
        {
            $limit: parseInt(limit)
        },
        {
            $lookup: {
                from: "users",
                localField: "artist",
                foreignField: "_id",
                as: "artist"
            }
        },
        {
            $unwind: "$artist"
        },
        {
            $project: {
                "artist.password": 0,
                "artist.refreshToken": 0
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, arts, "Trending art pieces retrieved successfully!")
    );
});

// Search art pieces by tags
const searchArtByTags = asyncHandler(async (req, res) => {
    const { tags, page = 1, limit = 10 } = req.query;

    if (!tags) {
        throw new ApiError(400, "Tags parameter is required!");
    }

    const tagArray = tags.split(',').map(tag => tag.trim());
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const arts = await Art.find({
        tags: { $in: tagArray }
    })
    .populate("artist", "userName avatar")
    .populate("likes", "userName avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Art.countDocuments({
        tags: { $in: tagArray }
    });

    return res.status(200).json(
        new ApiResponse(200, {
            arts,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        }, "Art pieces found by tags!")
    );
});

// Get art statistics
const getArtStats = asyncHandler(async (req, res) => {
    const stats = await Art.aggregate([
        {
            $group: {
                _id: null,
                totalArt: { $sum: 1 },
                totalForSale: { $sum: { $cond: ["$isForSale", 1, 0] } },
                avgPrice: { $avg: "$price" },
                totalLikes: { $sum: { $size: "$likes" } },
                totalComments: { $sum: { $size: "$comments" } }
            }
        }
    ]);

    const artFormStats = await Art.aggregate([
        {
            $group: {
                _id: "$artForm",
                count: { $sum: 1 }
            }
        },
        {
            $sort: { count: -1 }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, {
            overall: stats[0] || {
                totalArt: 0,
                totalForSale: 0,
                avgPrice: 0,
                totalLikes: 0,
                totalComments: 0
            },
            byArtForm: artFormStats
        }, "Art statistics retrieved successfully!")
    );
});

// Get artist leaderboard based on total likes
const getArtistLeaderboard = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, timeFrame = "all" } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build date filter based on timeFrame
    let dateFilter = {};
    const now = new Date();
    
    switch (timeFrame) {
        case "week":
            dateFilter = {
                createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }
            };
            break;
        case "month":
            dateFilter = {
                createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) }
            };
            break;
        case "year":
            dateFilter = {
                createdAt: { $gte: new Date(now.getFullYear(), 0, 1) }
            };
            break;
        case "all":
        default:
            dateFilter = {};
            break;
    }

    // Aggregate to get artist leaderboard
    const leaderboard = await Art.aggregate([
        // Match by time frame if specified
        ...(Object.keys(dateFilter).length > 0 ? [{ $match: dateFilter }] : []),
        
        // Group by artist and calculate total likes
        {
            $group: {
                _id: "$artist",
                totalLikes: { $sum: { $size: "$likes" } },
                totalArt: { $sum: 1 },
                totalComments: { $sum: { $size: "$comments" } },
                avgLikesPerArt: { $avg: { $size: "$likes" } },
                artPieces: {
                    $push: {
                        _id: "$_id",
                        title: "$title",
                        artForm: "$artForm",
                        likes: { $size: "$likes" },
                        comments: { $size: "$comments" },
                        createdAt: "$createdAt"
                    }
                }
            }
        },
        
        // Sort by total likes (descending)
        {
            $sort: { totalLikes: -1, avgLikesPerArt: -1 }
        },
        
        // Skip for pagination
        { $skip: skip },
        
        // Limit results
        { $limit: parseInt(limit) },
        
        // Lookup artist details
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "artist"
            }
        },
        
        // Unwind artist array
        {
            $unwind: "$artist"
        },
        
        // Project only needed fields
        {
            $project: {
                "artist.password": 0,
                "artist.refreshToken": 0,
                "artist.email": 0
            }
        }
    ]);

    // Get total count for pagination
    const totalCount = await Art.aggregate([
        ...(Object.keys(dateFilter).length > 0 ? [{ $match: dateFilter }] : []),
        {
            $group: {
                _id: "$artist"
            }
        },
        {
            $count: "total"
        }
    ]);

    const total = totalCount.length > 0 ? totalCount[0].total : 0;

    // Add ranking to each artist
    const leaderboardWithRanking = leaderboard.map((artist, index) => ({
        ...artist,
        rank: skip + index + 1
    }));

    return res.status(200).json(
        new ApiResponse(200, {
            leaderboard: leaderboardWithRanking,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total,
                itemsPerPage: parseInt(limit)
            },
            timeFrame: timeFrame
        }, "Artist leaderboard retrieved successfully!")
    );
});

// Get top performing art pieces by likes
const getTopArtPieces = asyncHandler(async (req, res) => {
    const { limit = 10, timeFrame = "all", artForm } = req.query;

    // Build date filter based on timeFrame
    let dateFilter = {};
    const now = new Date();
    
    switch (timeFrame) {
        case "week":
            dateFilter = {
                createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }
            };
            break;
        case "month":
            dateFilter = {
                createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) }
            };
            break;
        case "year":
            dateFilter = {
                createdAt: { $gte: new Date(now.getFullYear(), 0, 1) }
            };
            break;
        case "all":
        default:
            dateFilter = {};
            break;
    }

    // Add art form filter if specified
    if (artForm) {
        dateFilter.artForm = artForm;
    }

    const topArtPieces = await Art.aggregate([
        // Match by filters
        { $match: dateFilter },
        
        // Add like count field
        {
            $addFields: {
                likeCount: { $size: "$likes" },
                commentCount: { $size: "$comments" }
            }
        },
        
        // Sort by likes (descending)
        {
            $sort: { likeCount: -1, commentCount: -1, createdAt: -1 }
        },
        
        // Limit results
        { $limit: parseInt(limit) },
        
        // Lookup artist details
        {
            $lookup: {
                from: "users",
                localField: "artist",
                foreignField: "_id",
                as: "artist"
            }
        },
        
        // Unwind artist array
        {
            $unwind: "$artist"
        },
        
        // Project only needed fields
        {
            $project: {
                "artist.password": 0,
                "artist.refreshToken": 0,
                "artist.email": 0
            }
        }
    ]);

    // Add ranking
    const topArtWithRanking = topArtPieces.map((art, index) => ({
        ...art,
        rank: index + 1
    }));

    return res.status(200).json(
        new ApiResponse(200, {
            topArtPieces: topArtWithRanking,
            timeFrame: timeFrame,
            artForm: artForm || "all"
        }, "Top art pieces retrieved successfully!")
    );
});

export {
    createArt,
    getAllArt,
    getArtById,
    updateArt,
    deleteArt,
    toggleLike,
    addComment,
    removeComment,
    getArtByArtist,
    getLikedArt,
    getTrendingArt,
    searchArtByTags,
    getArtStats,
    getArtistLeaderboard,
    getTopArtPieces
};
