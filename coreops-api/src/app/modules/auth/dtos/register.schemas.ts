import { z } from "zod"

export const registerSchema = z.object({
  organizationName: z.string().min(3),
  adminName: z.string().min(3),
  email: z.email(),
  password: z.string().min(6),
})
