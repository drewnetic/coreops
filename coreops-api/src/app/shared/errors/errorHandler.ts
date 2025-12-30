import { FastifyError, FastifyReply, FastifyRequest } from "fastify"
import { ZodError } from "zod"
import { ConflictError } from "./ConflictError"
import { UnauthorizedError } from "./UnauthorizedError"
import { NotFoundError } from "./NotFoundError"
import { ForbiddenError } from "./ForbiddenError"

export function errorHandler(
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation error",
      errors: error.flatten().fieldErrors,
    })
  }

  if (error instanceof UnauthorizedError) {
    return reply.status(401).send({ message: error.message })
  }

  if (error instanceof ForbiddenError) {
    return reply.status(403).send({ message: error.message })
  }

  if (error instanceof ConflictError) {
    return reply.status(409).send({ message: error.message })
  }

  if (error instanceof NotFoundError) {
    return reply.status(404).send({ message: error.message })
  }

  console.error(error)

  return reply.status(500).send({
    message: "Internal server error",
  })
}
