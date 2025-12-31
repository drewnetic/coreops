import { FastifyInstance } from "fastify"
import { env } from "../../../../infra/env"
import { loginController } from "../controllers/auth.controller"
import { registerController } from "../controllers/register.controller"
import {
  logoutController,
  refreshController,
} from "../controllers/token.controller"

export async function authRoutes(app: FastifyInstance) {
  app.post(
    "/login",
    {
      schema: {
        tags: ["Auth"],
        summary: "Login user",
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              examples: ["admin@test.com"],
            },
            password: { type: "string", examples: ["123456"] },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              accessToken: { type: "string" },
              refreshToken: { type: "string" },
            },
          },
          401: {
            message: "Invalid credentials",
          },
        },
      },
    },
    loginController,
  )

  // DEV ONLY
  if (env.NODE_ENV !== "production") {
    app.post(
      "/register",
      {
        schema: {
          tags: ["Auth"],
          summary: "Register organization and admin (dev only)",
          body: {
            type: "object",
            required: ["organizationName", "adminName", "email", "password"],
            properties: {
              organizationName: { type: "string", examples: ["Coreops Corp"] },
              adminName: { type: "string", examples: ["Admin User"] },
              email: {
                type: "string",
                format: "email",
                examples: ["admin@coreops.com"],
              },
              password: { type: "string", examples: ["123456"] },
            },
          },
          response: {
            201: {
              message: "Orgainzation created",
            },
            409: {
              message: "Email already in use",
            },
          },
        },
      },
      registerController,
    )
  }

  app.post(
    "/refresh",
    {
      schema: {
        tags: ["Auth"],
        summary: "Refresh access token",
        response: {
          200: {
            type: "object",
            properties: {
              accessToken: { type: "string" },
            },
          },
          401: {
            message: "Invalid refresh token",
          },
        },
      },
    },
    refreshController,
  )
  app.post(
    "/logout",
    {
      schema: {
        tags: ["Auth"],
        summary: "Logout user",
        response: {
          204: {
            description: "Logged out successfully",
          },
        },
      },
    },
    logoutController,
  )
}
