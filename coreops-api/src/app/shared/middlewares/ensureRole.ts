import { FastifyReply, FastifyRequest } from "fastify"

type Role = "ADMIN" | "MANAGER" | "USER"

export function ensureRole(roles: Role[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as { role?: Role } | undefined

    if (!user || !user.role) {
      return reply.status(401).send({ message: "Unauthorized" })
    }

    if (!roles.includes(user.role)) {
      return reply.status(403).send({ message: "Forbidden" })
    }
  }
}
