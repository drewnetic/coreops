import { FastifyInstance } from "fastify"
import { ensureAuth } from "../../../shared/middlewares/ensureAuth"
import { ensureRole } from "../../../shared/middlewares/ensureRole"
import {
  createUnitController,
  listUnitsController,
} from "../controllers/units.controller"

export async function unitRoutes(app: FastifyInstance) {
  app.post(
    "/",
    { preHandler: [ensureAuth, ensureRole(["ADMIN"])] },
    createUnitController,
  )

  app.get(
    "/",
    { preHandler: [ensureAuth, ensureRole(["ADMIN", "MANAGER"])] },
    listUnitsController,
  )
}
