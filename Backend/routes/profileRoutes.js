import express from "express"
import { createProfile, getProfileByUsername } from "../controllers/profileController.js"

const router = express.Router()

router.post("/", createProfile)

router.get("/:username", getProfileByUsername)

export default router