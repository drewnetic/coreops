import { FastifyReply, FastifyRequest } from "fastify"

export async function ensureAuth(request: FastifyRequest, reply: FastifyReply) {
  try {
    const payload = await request.jwtVerify<{
      sub: string
      role: "ADMIN" | "MANAGER" | "USER"
      organizationId: string
    }>()

    request.user = {
      sub: payload.sub,
      role: payload.role,
      organizationId: payload.organizationId,
    }
  } catch {
    return reply.status(401).send({ message: "Unauthorized" })
  }
}
