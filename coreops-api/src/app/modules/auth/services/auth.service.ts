import bcrypt from "bcryptjs"
import { prisma } from "../../../../infra/database"
import { redis } from "../../../../infra/redis"
import { auditLog } from "../../../shared/audit/audit"
import {
  signAccessToken,
  signRefreshToken,
} from "../../../shared/auth/token.service"
import { UnauthorizedError } from "../../../shared/errors/UnauthorizedError"

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !user.isActive) {
    throw new UnauthorizedError("Invalid credentials")
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash)
  if (!passwordMatch) {
    throw new UnauthorizedError("Invalid credentials")
  }

  await auditLog({
    action: "LOGIN",
    entity: "User",
    entityId: user.id,
    userId: user.id,
  })

  await redis.del(`session:${user.id}`)

  const accessToken = signAccessToken({
    sub: user.id,
    role: user.role,
    organizationId: user.organizationId,
  })

  const refreshToken = signRefreshToken({ sub: user.id })

  await redis.set(`session:${user.id}`, refreshToken, "EX", 60 * 60 * 24 * 7)

  return { accessToken, refreshToken }
}
