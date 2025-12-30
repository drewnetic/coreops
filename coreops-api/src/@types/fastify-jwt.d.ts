import "@fastify/jwt"

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      sub: string
      role: "ADMIN" | "MANAGER" | "USER"
      organizationId: string
    }
    user: {
      sub: string
      role: "ADMIN" | "MANAGER" | "USER"
      organizationId: string
    }
  }
}
