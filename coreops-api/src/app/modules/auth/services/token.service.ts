import jwt from "jsonwebtoken"
import { prisma } from "../../../../infra/database"
import { redis } from "../../../../infra/redis"
import { env } from "../../../../infra/env"
import { InvalidTokenError } from "../../../shared/errors/InvalidTokenError"

interface RefreshTokenPayload {
  sub: string
}

interface AccessTokenPayload {
  sub: string
  role: string
  organizationId: string
}

function sessionKey(userId: string) {
  return `session:${userId}`
}

export function signRefreshToken(payload: RefreshTokenPayload) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "7d",
  })
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  try {
    return jwt.verify(token, env.JWT_SECRET) as RefreshTokenPayload
  } catch {
    throw new InvalidTokenError("Refresh token is invalid or expired")
  }
}

export function signAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "15m",
  })
}

export async function refreshSession(refreshToken: string) {
  const decoded = verifyRefreshToken(refreshToken)
  const userId = decoded.sub

  const stored = await redis.get(sessionKey(userId))
  if (!stored || stored !== refreshToken) {
    throw new InvalidTokenError("Session not found or refresh token revoked")
  }

  const newRefreshToken = signRefreshToken({ sub: userId })

  await redis.set(sessionKey(userId), newRefreshToken, "EX", 60 * 60 * 24 * 7)

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      organizationId: true,
      isActive: true,
    },
  })

  if (!user || !user.isActive) {
    throw new InvalidTokenError("User not found or inactive")
  }

  const accessToken = signAccessToken({
    sub: user.id,
    role: user.role,
    organizationId: user.organizationId,
  })

  return {
    accessToken,
    refreshToken: newRefreshToken,
  }
}

export async function logoutSession(userId: string) {
  await redis.del(sessionKey(userId))
}
