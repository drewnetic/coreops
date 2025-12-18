import bcrypt from "bcryptjs"
import { prisma } from "../../../../infra/database"
import { ConflictError } from "../../../shared/errors/ConflictError"

interface CreateUserInput {
  name: string
  email: string
  password: string
  role: "ADMIN" | "MANAGER" | "USER"
  unitId?: string
  organizationId: string
}

export async function createUser(data: CreateUserInput) {
  const emailExists = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (emailExists) {
    throw new ConflictError("Email already in use")
  }

  const passwordHash = await bcrypt.hash(data.password, 10)

  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role,
      unitId: data.unitId,
      organizationId: data.organizationId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      unitId: true,
      createdAt: true,
    },
  })
}
