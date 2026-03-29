import db from "../config/db.js";

// Send follow request
export const sendFollowRequest = async (req, res) => {
  const { userId } = req.body; // user to follow
  const followerId = req.user.id;

  try {
    await db.query(
      "INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)",
      [followerId, userId]
    );

    res.json({ message: "Follow request sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error sending request" });
  }
};

// Accept follow request
export const acceptFollowRequest = async (req, res) => {
  const { followerId } = req.body;
  const followingId = req.user.id;

  try {
    await db.query(
      "UPDATE follows SET status = 'accepted' WHERE follower_id = $1 AND following_id = $2",
      [followerId, followingId]
    );

    res.json({ message: "Follow request accepted" });
  } catch (err) {
    res.status(500).json({ error: "Error accepting request" });
  }
};

// Check if user follows another
export const checkFollow = async (followerId, followingId) => {
  const result = await db.query(
    "SELECT * FROM follows WHERE follower_id=$1 AND following_id=$2 AND status='accepted'",
    [followerId, followingId]
  );

  return result.rows.length > 0;
};