import { FastifyInstance } from "fastify"
import { ensureAuth } from "../../../shared/middlewares/ensureAuth"
import { ensureRole } from "../../../shared/middlewares/ensureRole"
import { createUserController } from "../controllers/user.controller"

export async function usersRoutes(app: FastifyInstance) {
  app.post(
    "/",
    { preHandler: [ensureAuth, ensureRole(["ADMIN"])] },
    createUserController,
  )
}
