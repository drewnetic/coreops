import { FastifyReply, FastifyRequest } from "fastify"
import {
  createOperationSchema,
  listOperationsQuerySchema,
  updateOperationStatusSchema,
} from "../dtos/operations.schemas"
import {
  createOperation,
  listOperations,
  updateOperationStatus,
} from "../services/operations.service"

export async function createOperationController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { title, description, unitId } = createOperationSchema.parse(
    request.body,
  )

  const user = request.user as { sub: string; organizationId: string }

  const operation = await createOperation({
    title,
    description,
    unitId,
    organizationId: user.organizationId,
    actorId: user.sub,
    ip: request.ip,
  })

  return reply.status(201).send(operation)
}

export async function listOperationsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { status, unitId, page, limit } = listOperationsQuerySchema.parse(
    request.query,
  )

  const user = request.user as { organizationId: string }

  const result = await listOperations({
    organizationId: user.organizationId,
    status,
    unitId,
    page,
    limit,
  })
  return reply.send(result)
}

export async function updateOperationStatusController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.params as { id: string }
  const { status } = updateOperationStatusSchema.parse(request.body)

  const user = request.user as { organizationId: string; sub: string }
  const ip = request.ip

  const updated = await updateOperationStatus({
    id,
    status,
    organizationId: user.organizationId,
    actorId: user.sub,
    ip,
  })

  return reply.send(updated)
}
