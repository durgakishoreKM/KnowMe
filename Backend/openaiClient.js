import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config(); // make sure .env is loaded

if (!process.env.OPENAI_API_KEY) {
  console.error("Error: OPENAI_API_KEY is not defined in .env");
  process.exit(1); // stop server if key is missing
}

export const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});