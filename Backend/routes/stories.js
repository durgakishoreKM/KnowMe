import express from "express";
import slugify from "slugify";
import db from "../config/db.js";

const router = express.Router();

// ✅ GET story by username + slug
router.get("/u/:username/:slug", async (req, res) => {
  try {
    const { username, slug } = req.params;

    const result = await db.query(
      "SELECT * FROM stories WHERE username = $1 AND slug = $2",
      [username, slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Story not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ CREATE story
router.post("/", async (req, res) => {
  try {
    const { title, content, username, userId, type } = req.body;

    // 🚨 SAFETY CHECK
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    // 🔥 Generate slug
    let baseSlug = slugify(title, { lower: true, strict: true });

    if (!baseSlug) {
      baseSlug = "untitled";
    }

    let slug = baseSlug;

    // 🔁 Ensure uniqueness
    let counter = 1;
    while (true) {
      const check = await db.query(
        "SELECT 1 FROM stories WHERE username = $1 AND slug = $2",
        [username, slug]
      );

      if (check.rows.length === 0) break;

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // ✅ Insert
    const result = await db.query(
      `INSERT INTO stories 
       (title, content, slug, username, user_id, type) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [title, content, slug, username, userId, type]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error("CREATE STORY ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;