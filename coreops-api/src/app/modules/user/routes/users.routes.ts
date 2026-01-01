import { FastifyInstance } from "fastify"
import { ensureAuth } from "../../../shared/middlewares/ensureAuth"
import { ensureRole } from "../../../shared/middlewares/ensureRole"
import { createUserController } from "../controllers/user.controller"

export async function usersRoutes(app: FastifyInstance) {
  app.post(
    "/",
    {
      preHandler: [ensureAuth, ensureRole(["ADMIN"])],
      schema: {
        tags: ["Users"],
        summary: "Create user (ADMIN only)",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          required: ["name", "email", "password", "role"],
          properties: {
            name: { type: "string", examples: ["John Doe"] },
            email: { type: "string", format: "email" },
            password: { type: "string", examples: ["123456"] },
            role: {
              type: "string",
              enum: ["ADMIN", "MANAGER", "USER"],
            },
            unitId: {
              type: "string",
              format: "uuid",
              nullable: true,
            },
          },
        },
        response: {
          201: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              email: { type: "string" },
              role: { type: "string" },
              unitId: { type: "string", nullable: true },
              createdAt: { type: "string", format: "date-time" },
            },
          },
          409: {
            description: "Email already in use",
          },
        },
      },
    },
    createUserController,
  )
}
