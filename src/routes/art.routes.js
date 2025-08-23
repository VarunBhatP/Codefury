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
    getArtStats,
    getArtistLeaderboard,
    getTopArtPieces,
    getUserArtCount
} from "../controllers/art.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middle_ware.js";

const router = Router();

// Apply JWT verification to all routes that require authentication
// router.use(verifyJWT);

// Create new art piece (requires authentication and file upload)
router.post(
    "/createArt",
    upload.fields([
        { name: "images", maxCount: 5 } // Allow up to 5 images
    ]),
    createArt
);

// Get all art pieces (public route - no authentication required)
router.get("/getAllArt", getAllArt);

// Get art piece by ID (public route)
router.get("/getArtById/:artId", getArtById);

// Update art piece (requires authentication and optional file upload)
router.patch(
    "/:artId",
    upload.fields([
        { name: "images", maxCount: 5 }
    ]),
    updateArt
);

// Delete art piece (requires authentication)
router.delete("/deleteArt/:artId", deleteArt);

// Like/Unlike art piece (requires authentication)
router.patch("/likeArt/:artId", toggleLike);

// Add comment to art piece (requires authentication)
router.post("/addComment/:artId", addComment);

// Remove comment from art piece (requires authentication)
router.delete("/deleteCommentFromArt/:artId/comments/:commentId", removeComment);

// Get art pieces by specific artist (public route)
router.get("/user/:artistId", getArtByArtist);

// Get user's liked art pieces (requires authentication)
router.get("/myLikes", getLikedArt);

// Get trending art pieces (public route)
router.get("/showTrending", getTrendingArt);

// Search art pieces by tags (public route)
router.get("/search/tags", searchArtByTags);

// Get art statistics (public route)
router.get("/stats/overview", getArtStats);

// Get artist leaderboard (public route)
router.get("/leaderboard/artists", getArtistLeaderboard);

// Get top performing art pieces (public route)
router.get("/leaderboard/artpieces", getTopArtPieces);

//to et art count of user
router.get('/getUserArtCount',getUserArtCount);

export default router;
