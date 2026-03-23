import pool from "../config/db.js"
import { generateQRCode } from "../services/qrService.js"

export const createProfile = async (req, res) => {

  try {

    const { username, display_name, bio } = req.body

    // create user
    const userResult = await pool.query(
      "INSERT INTO users (username) VALUES ($1) RETURNING *",
      [username]
    )

    const user = userResult.rows[0]

    // create profile
    const profileResult = await pool.query(
      "INSERT INTO profiles (user_id, display_name, bio) VALUES ($1,$2,$3) RETURNING *",
      [user.id, display_name, bio]
    )

    const profile = profileResult.rows[0]

    // profile URL
    const profileUrl = `${process.env.FRONTEND_URL}/u/${username}`

    // generate QR
    const qrCode = await generateQRCode(profileUrl)

    res.json({
      user,
      profile,
      profileUrl,
      qrCode
    })

  } catch (error) {

    console.error(error)
    res.status(500).json({ error: "Error creating profile" })

  }

}

export const getProfileByUsername = async (req, res) => {

  try {

    const { username } = req.params

    const result = await pool.query(
      `SELECT users.username, profiles.display_name, profiles.bio
       FROM users
       JOIN profiles ON users.id = profiles.user_id
       WHERE users.username = $1`,
      [username]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Profile not found" })
    }

    res.json(result.rows[0])

  } catch (error) {

    console.error(error)
    res.status(500).json({ error: "Server error" })

  }

}