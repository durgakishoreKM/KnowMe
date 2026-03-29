import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import storyRoutes from "./routes/storyRoutes.js";
import followRoutes from "./routes/followRoutes.js";
import aiRoutes from "./routes/ai.js";

import { authMiddleware } from "./middleware/authMiddleware.js";
import pool from "./config/db.js";

const app = express();

// DB Connection Test
pool.query("SELECT 1")
  .then(() => console.log("DB Connected ✅"))
  .catch(err => console.error("DB Error ❌", err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes (CLEAN STRUCTURE)
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/ai", aiRoutes);

// Health Check
app.get("/", (req, res) => {
  res.send("KnowMe Backend Running 🚀");
});

// Protected Test Route
app.get("/api/test-protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route works ✅",
    user: req.user,
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});