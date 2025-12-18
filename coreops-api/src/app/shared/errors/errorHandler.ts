import { FastifyError, FastifyReply, FastifyRequest } from "fastify"
import { ZodError } from "zod"
import { AppError } from "./AppError"

export function errorHandler(
  error: FastifyError | Error,
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      message: error.message,
    })
  }

  if (error instanceof ZodError) {
    const formattedErrors: Record<string, string> = {}

    error.issues.forEach((err) => {
      const field = err.path.join(".")
      formattedErrors[field] = err.message
    })

    return reply.status(400).send({
      message: "Validation error",
      errors: formattedErrors,
    })
  }

  return reply.status(500).send({ message: "Internal server error" })
}
