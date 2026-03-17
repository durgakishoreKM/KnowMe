import dotenv from "dotenv"
dotenv.config()
import pool from './config/db.js';

import express from "express"
import cors from "cors"
import userRoutes from "./routes/userRoutes.js"
import profileRoutes from "./routes/profileRoutes.js"

const app = express()

app.use(cors())
app.use(express.json())
app.use("/api/users", userRoutes)
app.use("/api/profile", profileRoutes)

// Root route
app.get("/", (req, res) => {
  res.send("KnowMe Backend Running")
})

const PORT = 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

