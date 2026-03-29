import db from "../config/db.js";
import { checkFollow } from "./followController.js";
import slugify from "slugify";

// CREATE STORY
export const createStory = async (req, res) => {
  const { title, content, visibility } = req.body;
  console.log("req.body:", req.body);
  console.log("req.user:", req.user);
  const userId = req.user.id;
  if (!userId) {
    return res.status(400).json({ error: "User not found" });
  }
  try {
    const slug = slugify(title || "story", { lower: true }) + "-" + Date.now();
    const result = await db.query(
      `INSERT INTO stories (title, content, user_id, visibility, slug)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, content, userId, visibility || "public", slug]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("CREATE STORY ERROR:", err.message);
    res.status(400).json({ error: "Create failed" });
  }
};


// GET STORY BY ID (WITH ACCESS CONTROL)
export const getStoryById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const result = await db.query(
      "SELECT * FROM stories WHERE id = $1",
      [id]
    );

    const story = result.rows[0];
    if (!story) return res.status(404).json({ message: "Not found" });

    // Public
    if (story.visibility === "public") {
      return res.json(story);
    }

    // Followers Only
    if (story.visibility === "followers") {
      if (!userId) {
        return res.status(401).json({ message: "Login required" });
      }

      const isFollower = await checkFollow(userId, story.user_id);

      if (!isFollower) {
        return res.status(403).json({ message: "Followers only" });
      }

      return res.json(story);
    }

    // Private
    if (story.visibility === "private") {
      if (story.user_id !== userId) {
        return res.status(403).json({ message: "Not allowed" });
      }

      return res.json(story);
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getStoriesByUser = async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user?.id;

  try {
    let query = "";
    let values = [];

    console.log("currentUserId:", currentUserId);
    console.log("userId:", userId);
    if (currentUserId == userId) {
      // 👤 Owner → see all
      query = "SELECT * FROM stories WHERE user_id = $1 ORDER BY created_at DESC";
      values = [userId];
    } else {
      // 🌍 Others → only public
      query = "SELECT * FROM stories WHERE user_id = $1 AND visibility = 'public' ORDER BY created_at DESC";
      values = [userId];
    }

    const result = await db.query(query, values);

    res.json(result.rows);
    console.log("USER QUERY RESULT:", result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching stories" });
  }
};