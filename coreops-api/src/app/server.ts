import cookie from "@fastify/cookie"
import jwt from "@fastify/jwt"
import Fastify from "fastify"
import { env } from "../infra/env"
import { authRoutes } from "./modules/auth/routes/auth.routes"
import { errorHandler } from "./shared/errors/errorHandler"

export const app = Fastify({
  logger: true,
})

app.register(cookie)

app.register(jwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
})

app.register(authRoutes, { prefix: "/api/auth" })

app.setErrorHandler(errorHandler)

export async function startServer() {
  try {
    await app.listen({ port: 3333, host: "0.0.0.0" })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}
