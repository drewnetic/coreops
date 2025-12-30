import { FastifyReply, FastifyRequest } from "fastify"
import { registerSchema } from "../dtos/register.schemas"
import { registerOrganizationAdmin } from "../services/register.service"

export async function registerController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { organizationName, adminName, email, password } = registerSchema.parse(
    request.body,
  )

  await registerOrganizationAdmin(organizationName, adminName, email, password)

  return reply.status(201).send({ message: "Orgainzation created" })
}
