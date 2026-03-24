import bcrypt from "bcrypt";
import db from "../config/db.js";
import generateToken from "../utils/generateToken.js";

// SIGNUP
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );

    const token = generateToken(newUser.rows[0]);

    res.status(201).json({
      user: newUser.rows[0],
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userResult = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
      id: user.id,
      username: user.username,
    });

    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    res.json({
      user: safeUser,
      token,
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);

    // ✅ SAFE error response
    res.status(500).json({
      message: "Server error during login",
    });
  }
};

