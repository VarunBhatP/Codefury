import { Router } from "express";
import {
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
    getArtStats
} from "../controller/art.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middle_ware.js";

const router = Router();

// Apply JWT verification to all routes that require authentication
router.use(verifyJWT);

// Create new art piece (requires authentication and file upload)
router.post(
    "/createArt",
    upload.fields([
        { name: "images", maxCount: 5 } // Allow up to 5 images
    ]),
    createArt
);

// Get all art pieces (public route - no authentication required)
router.get("/", getAllArt);

// Get art piece by ID (public route)
router.get("/:artId", getArtById);

// Update art piece (requires authentication and optional file upload)
router.patch(
    "/:artId",
    upload.fields([
        { name: "images", maxCount: 5 }
    ]),
    updateArt
);

// Delete art piece (requires authentication)
router.delete("/:artId", deleteArt);

// Like/Unlike art piece (requires authentication)
router.patch("/:artId/like", toggleLike);

// Add comment to art piece (requires authentication)
router.post("/:artId/comments", addComment);

// Remove comment from art piece (requires authentication)
router.delete("/:artId/comments/:commentId", removeComment);

// Get art pieces by specific artist (public route)
router.get("/artist/:artistId", getArtByArtist);

// Get user's liked art pieces (requires authentication)
router.get("/user/liked", getLikedArt);

// Get trending art pieces (public route)
router.get("/trending/art", getTrendingArt);

// Search art pieces by tags (public route)
router.get("/search/tags", searchArtByTags);

// Get art statistics (public route)
router.get("/stats/overview", getArtStats);

export default router;
