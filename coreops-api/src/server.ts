import cookie from "@fastify/cookie"
import cors from "@fastify/cors"
import helmet from "@fastify/helmet"
import rateLimit from "@fastify/rate-limit"
import fastifyJwt from "@fastify/jwt"
import swagger from "@fastify/swagger"
import fastifyApiReference from "@scalar/fastify-api-reference"
import Fastify from "fastify"
import { authRoutes } from "./app/modules/auth/routes/auth.routes"
import { operationsRoutes } from "./app/modules/operations/routes/operations.routes"
import { unitRoutes } from "./app/modules/units/routes/units.routes"
import { usersRoutes } from "./app/modules/user/routes/users.routes"
import { errorHandler } from "./app/shared/errors/errorHandler"
import { env } from "./infra/env"

export function buildApp() {
  const app = Fastify({
    logger: true,
  })

  app.register(cookie)

  app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
      cookieName: "refreshToken",
      signed: false,
    },
  })

  app.register(cors, {
    origin: (origin, cb) => {
      if (!origin) return cb(null, true)

      const allowedOrigins = [
        "http://localhost:3333",
        "https://coreops-production.up.railway.app",
      ]

      if (allowedOrigins.includes(origin)) {
        cb(null, true)
      } else {
        cb(new Error("Not allowed by CORS"), false)
      }
    },
    credentials: true,
  })

  app.register(helmet, {
    global: true,
    contentSecurityPolicy: false,
  })

  app.addHook("onRequest", async (req, reply) => {
    if (req.url.startsWith("/docs")) return

    reply.header(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self'",
        "img-src 'self' data:",
        "connect-src 'self'",
      ].join("; "),
    )
  })

  app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  })

  if (env.NODE_ENV !== "test") {
    app.register(swagger, {
      openapi: {
        info: {
          title: "CoreOps API",
          description: "CoreOps backend API documentation",
          version: "1.0.0",
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    })

    app.register(fastifyApiReference, {
      routePrefix: "/docs",
    })
  }

  app.setErrorHandler(errorHandler)

  app.register(authRoutes, { prefix: "/api/auth" })
  app.register(usersRoutes, { prefix: "/api/users" })
  app.register(operationsRoutes, { prefix: "/api/operations" })
  app.register(unitRoutes, { prefix: "/api/units" })

  return app
}
