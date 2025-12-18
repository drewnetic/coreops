import { FastifyReply, FastifyRequest } from "fastify"
import { loginSchema } from "./auth.schemas"
import { login } from "./auth.service"

export async function loginController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { email, password } = loginSchema.parse(request.body)

  const { accessToken, refreshToken } = await login(email, password)

  reply
    .setCookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
    })
    .send({ accessToken })
}
