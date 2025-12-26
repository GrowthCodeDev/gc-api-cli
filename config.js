import dotenv from "dotenv";
dotenv.config();

export const envConfig = {
  apiUrl: process.env.API_URL || "",
  apiKey: process.env.API_KEY || "",
  timeoutMs: Number(process.env.TIMEOUT_MS || 15000),
};
