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
    { preHandler: [ensureAuth, ensureRole(["ADMIN", "MANAGER"])] },
    createOperationController,
  )

  app.get(
    "/",
    { preHandler: [ensureAuth, ensureRole(["ADMIN", "MANAGER", "USER"])] },
    listOperationsController,
  )

  app.patch(
    "/:id/status",
    { preHandler: [ensureAuth, ensureRole(["ADMIN", "MANAGER"])] },
    updateOperationStatusController,
  )
}
