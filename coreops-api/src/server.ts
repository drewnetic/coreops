import cookie from "@fastify/cookie"
import fastifyJwt from "@fastify/jwt"
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

  app.setErrorHandler(errorHandler)

  app.register(authRoutes, { prefix: "/api/auth" })
  app.register(usersRoutes, { prefix: "/api/users" })
  app.register(operationsRoutes, { prefix: "/api/operations" })
  app.register(unitRoutes, { prefix: "/api/units" })

  return app
}
