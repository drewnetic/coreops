import { prisma } from "../../../../infra/database"
import { ConflictError } from "../../../shared/errors/ConflictError"

interface CreateUnitInput {
  name: string
  organizationId: string
}

export async function createUnit(input: CreateUnitInput) {
  const exists = await prisma.unit.findFirst({
    where: {
      name: input.name,
      organizationId: input.organizationId,
    },
  })

  if (exists) {
    throw new ConflictError("Unit already exists")
  }

  return prisma.unit.create({
    data: {
      name: input.name,
      organizationId: input.organizationId,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
  })
}

export async function listUnits(organizationId: string) {
  return prisma.unit.findMany({
    where: { organizationId },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
  })
}
