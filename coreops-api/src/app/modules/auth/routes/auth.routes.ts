import { FastifyInstance } from "fastify"
import { loginController } from "../controllers/auth.controller"
import { registerController } from "../controllers/register.controller"

export async function authRoutes(app: FastifyInstance) {
  app.post("/login", loginController)

  // DEV ONLY
  app.post("/register", registerController)
}
