import { FastifyInstance } from "fastify"
import { loginController } from "../controllers/auth.controller"
import { registerController } from "../controllers/register.controller"
import {
  logoutController,
  refreshController,
} from "../controllers/token.controller"

export async function authRoutes(app: FastifyInstance) {
  app.post("/login", loginController)

  // DEV ONLY
  app.post("/register", registerController)

  app.post("/refresh", refreshController)
  app.post("/logout", logoutController)
}
