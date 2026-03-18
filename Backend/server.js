import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import protect from "./middleware/authMiddleware.js";

import pool from "./config/db.js"; // ✅ use consistent name

const app = express();

// ✅ Test DB connection (correct way)
pool.query("SELECT 1")
  .then(() => console.log("DB Connected ✅"))
  .catch(err => console.error("DB Error ❌", err));

// Middleware
app.use(cors());

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("KnowMe Backend Running");
});

// Protected test route
app.post("/api/profile", protect, (req, res) => {
  res.json({
    message: "Profile created",
    user: req.user,
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});