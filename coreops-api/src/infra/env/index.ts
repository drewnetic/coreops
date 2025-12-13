import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.string(),
  PORT: z.string(),
  JWT_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
