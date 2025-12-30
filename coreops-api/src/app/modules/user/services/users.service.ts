import { UserRole } from "@prisma/client"
import bcrypt from "bcryptjs"
import { prisma } from "../../../../infra/database"
import { auditLog } from "../../../shared/audit/audit"
import { ConflictError } from "../../../shared/errors/ConflictError"
import { NotFoundError } from "../../../shared/errors/NotFoundError"

interface CreateUserInput {
  name: string
  email: string
  password: string
  role: UserRole
  unitId?: string
  organizationId: string
  adminId: string
}

export async function createUser(data: CreateUserInput, currentUser: any) {
  const emailExists = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (emailExists) {
    throw new ConflictError("Email already in use")
  }

  if (data.unitId) {
    const unit = await prisma.unit.findFirst({
      where: {
        id: data.unitId,
        organizationId: data.organizationId,
      },
    })

    if (!unit) {
      throw new NotFoundError("Unit not found")
    }
  }

  const passwordHash = await bcrypt.hash(data.password, 10)

  const createdUser = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role,
      ...(data.unitId ? { unitId: data.unitId } : {}),
      organizationId: currentUser.organizationId,
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

  await auditLog({
    action: "CREATE_USER",
    entity: "User",
    entityId: createdUser.id,
    userId: data.adminId,
  })

  return createdUser
}
