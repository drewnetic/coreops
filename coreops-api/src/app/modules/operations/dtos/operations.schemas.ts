import { z } from "zod"

export const createOperationSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  unitId: z.uuid(),
})

export const listOperationsQuerySchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "DONE", "CANCELED"]).optional(),
  unitId: z.uuid().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export const updateOperationStatusSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "DONE", "CANCELED"]),
})
