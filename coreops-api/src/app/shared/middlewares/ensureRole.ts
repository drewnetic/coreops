import { FastifyReply, FastifyRequest } from "fastify"

type Role = "ADMIN" | "MANAGER" | "USER"

export function ensureRole(roles: Role[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { role } = request.user as { role: Role }

      if (!roles.includes(role)) {
        return reply.status(403).send({ message: "Forbidden" })
      }
    } catch {
      return reply.status(401).send({ message: "Unauthorized" })
    }
  }
}
