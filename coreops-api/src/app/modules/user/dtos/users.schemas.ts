import { z } from "zod"

export const createUserSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "MANAGER", "USER"]),
  unitId: z.uuid().optional(),
})
