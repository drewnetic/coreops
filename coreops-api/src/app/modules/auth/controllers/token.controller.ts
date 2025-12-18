import { FastifyReply, FastifyRequest } from "fastify"
import { ensureAuth } from "../../../shared/middlewares/ensureAuth"
import { logoutSession, refreshSession } from "../services/token.service"

function cookieOptions() {
  const isProd = process.env.NODE_ENV === "production"

  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: isProd,
    path: "/",
  }
}

export async function refreshController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const refreshToken = request.cookies.refreshToken
  if (!refreshToken) {
    return reply.status(401).send({ message: "Refresh token missing" })
  }

  const { accessToken, refreshToken: newRefreshToken } =
    await refreshSession(refreshToken)

  return reply
    .setCookie("refreshToken", newRefreshToken, cookieOptions())
    .send({ accessToken })
}

export async function logoutController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await ensureAuth(request, reply)
  if (reply.sent) return

  const user = request.user as { sub: string }
  await logoutSession(user.sub)

  return reply.clearCookie("refreshToken", { path: "/" }).status(204).send()
}
