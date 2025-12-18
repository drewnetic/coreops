import { z } from "zod"

export const createUnitSchema = z.object({
  name: z.string().min(2),
})
