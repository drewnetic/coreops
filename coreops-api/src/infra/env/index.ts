import { z } from "zod"
import dotenv from "dotenv"

dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
})

const envSchema = z.object({
  NODE_ENV: z.string(),
  PORT: z.string(),
  JWT_SECRET: z.string(),
})

export const env = envSchema.parse(process.env)
