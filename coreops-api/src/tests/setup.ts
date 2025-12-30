import { afterAll, beforeEach } from "vitest"
import { prisma } from "../infra/database"

beforeEach(async () => {
  await prisma.auditLog.deleteMany()
  await prisma.operation.deleteMany()
  await prisma.user.deleteMany()
  await prisma.unit.deleteMany()
  await prisma.organization.deleteMany()
})

afterAll(async () => {
  await prisma.$disconnect()
})
