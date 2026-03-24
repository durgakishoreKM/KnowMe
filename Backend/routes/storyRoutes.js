import express from "express";
import pool from "../config/db.js";
import slugify from "slugify";

const router = express.Router();


// ✅ CREATE STORY
router.post("/", async (req, res) => {
  try {
    const { title, content, userId, type } = req.body;

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
      [title, content, slug, username, userId, type]
    );

    res.json(newStory.rows[0]);
  } catch (err) {
    console.error("CREATE STORY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ GET ALL STORIES BY USER
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const stories = await pool.query(
      "SELECT * FROM stories WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    res.json(stories.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch stories" });
  }
});


// ✅ GET SINGLE STORY BY ID
router.get("/:storyId", async (req, res) => {
  const { storyId } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM stories WHERE id = $1",
      [storyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Story not found" });
    }

    res.json(result.rows[0]); // 👈 return object (NOT array)
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch story" });
  }
});

router.get("/u/:username/:slug", async (req, res) => {
  try {
    const { username, slug } = req.params;

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

    // 🔒 LOCKED
    if (story.unlock_at && now < new Date(story.unlock_at)) {
      return res.json({
        mode: "locked",
        unlockAt: story.unlock_at,
        title: story.title
      });
    }

    // 📖 FULL
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

export default router;