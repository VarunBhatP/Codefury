import { Router } from "express";
import { createShareLink, getSharedContent } from "../controllers/share.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Secure route to create a share link for a specific art piece
router.route("/art/:artId/share").post(createShareLink);

// Public route to get the content from a share link
router.route("/share/:shareToken").get(getSharedContent);

export default router;