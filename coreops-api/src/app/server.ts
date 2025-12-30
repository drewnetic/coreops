import cookie from "@fastify/cookie"
import fastifyJwt from "@fastify/jwt"
import Fastify from "fastify"
import { env } from "../infra/env"
import { authRoutes } from "./modules/auth/routes/auth.routes"
import { operationsRoutes } from "./modules/operations/routes/operations.routes"
import { unitRoutes } from "./modules/units/routes/units.routes"
import { usersRoutes } from "./modules/user/routes/users.routes"
import { errorHandler } from "./shared/errors/errorHandler"

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

  app.setErrorHandler(errorHandler)

  app.register(authRoutes, { prefix: "/api/auth" })
  app.register(usersRoutes, { prefix: "/api/users" })
  app.register(operationsRoutes, { prefix: "/api/operations" })
  app.register(unitRoutes, { prefix: "/api/units" })

  return app
}
