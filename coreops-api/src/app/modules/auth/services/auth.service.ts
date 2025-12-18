import bcrypt from "bcryptjs"
import { prisma } from "../../../../infra/database"
import { redis } from "../../../../infra/redis"
import { app } from "../../../server"
import { ConflictError } from "../../../shared/errors/ConflictError"

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !user.isActive) {
    throw new Error("Invalid credentials")
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash)
  if (!passwordMatch) {
    throw new ConflictError("Invalid credentials")
  }

  await redis.del(`session:${user.id}`)

  const accessToken = app.jwt.sign(
    {
      sub: user.id,
      role: user.role,
      organizationId: user.organizationId,
    },
    {
      expiresIn: "15m",
    },
  )

  const refreshToken = app.jwt.sign({ sub: user.id }, { expiresIn: "7d" })

  await redis.set(`session:${user.id}`, refreshToken, "EX", 60 * 60 * 24 * 7)

  return { accessToken, refreshToken }
}
