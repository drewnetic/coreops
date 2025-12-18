import { FastifyReply, FastifyRequest } from "fastify"
import { createUserSchema } from "../dtos/users.schemas"
import { createUser } from "../services/users.service"

export async function createUserController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { name, email, password, role, unitId } = createUserSchema.parse(
    request.body,
  )

  const { organizationId } = request.user as { organizationId: string }

  const user = await createUser({
    name,
    email,
    password,
    role,
    unitId,
    organizationId,
  })

  return reply.status(201).send(user)
}
