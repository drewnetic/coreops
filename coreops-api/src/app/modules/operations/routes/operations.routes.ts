import { FastifyInstance } from "fastify"
import { ensureAuth } from "../../../shared/middlewares/ensureAuth"
import { ensureRole } from "../../../shared/middlewares/ensureRole"
import {
  createOperationController,
  listOperationsController,
  updateOperationStatusController,
} from "../controllers/operations.controller"

export async function operationsRoutes(app: FastifyInstance) {
  app.post(
    "/",
    {
      preHandler: [ensureAuth, ensureRole(["ADMIN", "MANAGER"])],
      schema: {
        tags: ["Operations"],
        summary: "Create operation",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          required: ["title", "unitId"],
          properties: {
            title: { type: "string", examples: ["Air conditioning broken"] },
            description: { type: "string", nullable: true },
            unitId: { type: "string" },
          },
        },
        response: {
          201: {
            type: "object",
            properties: {
              id: { type: "string" },
              title: { type: "string" },
              description: { type: "string", nullable: true },
              status: {
                type: "string",
                enum: ["OPEN", "IN_PROGRESS", "DONE", "CANCELED"],
              },
              unitId: { type: "string" },
              createdAt: { type: "string", format: "date-time" },
            },
          },
          404: {
            description: "Unit not found",
          },
        },
      },
    },
    createOperationController,
  )

  app.get(
    "/",
    {
      preHandler: [ensureAuth, ensureRole(["ADMIN", "MANAGER", "USER"])],
      schema: {
        tags: ["Operations"],
        summary: "List operations",
        security: [{ bearerAuth: [] }],
        querystring: {
          type: "object",
          properties: {
            status: {
              type: "string",
              enum: ["OPEN", "IN_PROGRESS", "DONE", "CANCELED"],
            },
            unitId: { type: "string" },
            page: { type: "number", default: 1 },
            limit: { type: "number", default: 10 },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    title: { type: "string" },
                    description: { type: "string" },
                    status: { type: "string" },
                    unitId: {
                      type: "string",
                      pattern:
                        "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$",
                    },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                  },
                },
              },
              meta: {
                type: "object",
                properties: {
                  page: { type: "number" },
                  limit: { type: "number" },
                  total: { type: "number" },
                  totalPages: { type: "number" },
                },
              },
            },
          },
        },
      },
    },
    listOperationsController,
  )

  app.patch(
    "/:id/status",
    {
      preHandler: [ensureAuth, ensureRole(["ADMIN", "MANAGER"])],
      schema: {
        tags: ["Operations"],
        summary: "Update operation status",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
          },
        },
        body: {
          type: "object",
          required: ["status"],
          properties: {
            status: {
              type: "string",
              enum: ["OPEN", "IN_PROGRESS", "DONE", "CANCELED"],
            },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              id: { type: "string" },
              status: { type: "string" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
          404: {
            description: "Operation not found",
          },
        },
      },
    },
    updateOperationStatusController,
  )
}
