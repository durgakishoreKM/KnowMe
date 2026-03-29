import express from "express";
import pool from "../config/db.js";
import slugify from "slugify";
import {
  createStory,
  getStoryById,
  getStoriesByUser
} from "../controllers/storyController.js";
import { authMiddleware, optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

//
// ✅ CREATE STORY (Protected)
//
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content, visibility } = req.body;
    const userId = req.user.id;

    if (!title && !content) {
      return res.status(400).json({ message: "Empty story" });
    }

    const slug =
      slugify(title, { lower: true, strict: true }) +
      "-" +
      Date.now();

    const userResult = await pool.query(
      "SELECT username FROM users WHERE id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const username = userResult.rows[0].username;

    const newStory = await pool.query(
      `INSERT INTO stories (title, content, slug, username, user_id, type)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, content, slug, username, userId, visibility]
    );

    res.json(newStory.rows[0]);
  } catch (err) {
    console.error("CREATE STORY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//
// ✅ GET ALL STORIES BY USER (Public)
//
router.get("/user/:userId", getStoriesByUser);

//
// ✅ GET STORY BY USERNAME + SLUG (Public + Optional Auth)
//
router.get("/u/:username/:slug", optionalAuth, async (req, res) => {
  try {
    const { username, slug } = req.params;
    const currentUserId = req.user?.id;

    const result = await pool.query(
      `SELECT s.*, u.username 
       FROM stories s
       JOIN users u ON s.user_id = u.id
       WHERE s.slug = $1 AND u.username = $2`,
      [slug, username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Story not found" });
    }

    const story = result.rows[0];
    const now = new Date();

    // 🔐 VISIBILITY LOGIC
    if (story.type === "followers") {
      if (!currentUserId) {
        return res.status(401).json({ error: "Login required" });
      }

      const isFollower = await checkFollow(currentUserId, story.user_id);

      if (!isFollower) {
        return res.status(403).json({ error: "Followers only" });
      }
    }

    if (story.type === "private") {
      if (story.user_id !== currentUserId) {
        return res.status(403).json({ error: "Not allowed" });
      }
    }

    // 🔒 LOCKED FEATURE
    if (story.unlock_at && now < new Date(story.unlock_at)) {
      return res.json({
        mode: "locked",
        unlockAt: story.unlock_at,
        title: story.title
      });
    }

    // ✅ FULL ACCESS
    return res.json({
      mode: "full",
      title: story.title,
      content: story.content
    });

  } catch (err) {
    console.error("FETCH STORY ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

//
// ✅ GET SINGLE STORY BY ID (Public)
//
router.get("/:id", getStoryById);

//
// ✅ DELETE STORY (Protected)
//
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM stories WHERE id = $1", [id]);

    res.json({ message: "Story deleted" });
  } catch (err) {
    console.error("DELETE STORY ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;