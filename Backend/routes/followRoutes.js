import express from "express";
import {
  sendFollowRequest,
  acceptFollowRequest,
} from "../controllers/followController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/request", authMiddleware, sendFollowRequest);
router.post("/accept", authMiddleware, acceptFollowRequest);

export default router;