import { FastifyReply, FastifyRequest } from "fastify"
import { createUnitSchema } from "../dtos/units.schemas"
import { createUnit, listUnits } from "../services/units.service"

export async function createUnitController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { name } = createUnitSchema.parse(request.body)
  const user = request.user as { organizationId: string }

  const unit = await createUnit({
    name,
    organizationId: user.organizationId,
  })

  return reply.status(201).send(unit)
}

export async function listUnitsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const user = request.user as { organizationId: string }
  const units = await listUnits(user.organizationId)

  return reply.send(units)
}
