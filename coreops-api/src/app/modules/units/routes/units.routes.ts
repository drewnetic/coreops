import { FastifyInstance } from "fastify"
import { ensureAuth } from "../../../shared/middlewares/ensureAuth"
import { ensureRole } from "../../../shared/middlewares/ensureRole"
import {
  createUnitController,
  listUnitsController,
} from "../controllers/units.controller"

export async function unitRoutes(app: FastifyInstance) {
  app.post(
    "/",
    {
      preHandler: [ensureAuth, ensureRole(["ADMIN"])],
      schema: {
        tags: ["Units"],
        summary: "Create a unit",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", examples: ["Main Unit"] },
          },
        },
        response: {
          201: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              createdAt: { type: "string", format: "date-time" },
            },
          },
          409: {
            description: "Unit already exists",
          },
        },
      },
    },
    createUnitController,
  )

  app.get(
    "/",
    {
      preHandler: [ensureAuth, ensureRole(["ADMIN", "MANAGER"])],
      schema: {
        tags: ["Units"],
        summary: "List units",
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                createdAt: { type: "string", format: "date-time" },
              },
            },
          },
        },
      },
    },
    listUnitsController,
  )
}
