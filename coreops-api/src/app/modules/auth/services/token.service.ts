import { prisma } from "../../../../infra/database"
import { redis } from "../../../../infra/redis"
import { app } from "../../../server"
import { InvalidTokenError } from "../../../shared/errors/InvalidTokenError"

function sessionKey(userId: string) {
  return `session:${userId}`
}

export async function refreshSession(refreshToken: string) {
  let decoded: { sub: string }

  try {
    decoded = app.jwt.verify<{ sub: string }>(refreshToken)
  } catch {
    throw new InvalidTokenError("Refresh token is invalid or expired")
  }

  const userId = decoded.sub

  const stored = await redis.get(sessionKey(userId))
  if (!stored || stored !== refreshToken) {
    throw new InvalidTokenError("Session not found or refresh token revoked")
  }

  const newRefreshToken = app.jwt.sign({ sub: userId }, { expiresIn: "7d" })

  await redis.set(sessionKey(userId), newRefreshToken, "EX", 60 * 60 * 24 * 7)

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, organizationId: true, isActive: true },
  })

  if (!user || !user.isActive) {
    throw new InvalidTokenError("User not found or inactive")
  }

  const accessToken = app.jwt.sign(
    { sub: user.id, role: user.role, organizationId: user.organizationId },
    { expiresIn: "15m" },
  )

  return { accessToken, refreshToken: newRefreshToken }
}

export async function logoutSession(userId: string) {
  await redis.del(sessionKey(userId))
}
