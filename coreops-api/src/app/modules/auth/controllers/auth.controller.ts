import { FastifyReply, FastifyRequest } from "fastify"
import { loginSchema } from "../dtos/auth.schemas"
import { login } from "../services/auth.service"

const isProd = process.env.NODE_ENV === "production"

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
      secure: isProd,
    })
    .send({ accessToken })
}
