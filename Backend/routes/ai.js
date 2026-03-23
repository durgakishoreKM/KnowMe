import express from "express";
import OpenAI from "openai";

const cache = new Map();
const router = express.Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/enhance", async (req, res) => {
  try {
    const { text, type } = req.body;

    const cacheKey = `${type}-${text}`;

    // ✅ Check cache first
    if (cache.has(cacheKey)) {
    console.log("⚡ Cache hit");
    return res.json({ result: cache.get(cacheKey) });
    }

    let prompt = "";

    if (type === "improve") {
      prompt = `Improve the following personal story writing while keeping it natural:\n\n${text}`;
    } else if (type === "emotional") {
      prompt = `Rewrite this personal story in a more emotional and engaging way:\n\n${text}`;
    } else if (type === "expand") {
      prompt = `Expand this personal story with more detail and depth:\n\n${text}`;
    }

    const response = await client.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
            {
            role: "system",
            content: `
                You are a cinematic life storytelling assistant.

                Your job is to transform personal experiences into engaging, emotional, and realistic life stories.

                Guidelines:
                - Write like a movie narrator (cinematic, immersive)
                - Keep it personal and authentic (not fictional or fairy tale)
                - Use vivid but simple language
                - Add emotional depth and smooth flow
                - Avoid clichés like "once upon a time"
                - Keep it human, relatable, and natural
                - Maintain the user's original meaning and details
            `,
            },
            {
            role: "user",
            content: prompt,
            },
        ],
    });

    const result = response.choices[0].message.content;
    cache.set(cacheKey, result);
    res.json({
      result: result,
    });
  } catch (error) {
    console.error("🔥 AI ERROR:", error);
    res.status(500).json({
        error: "AI failed",
        details: error.message,
    });
  }
});

export default router;