import { prisma } from "../../../../infra/database"
import { auditLog } from "../../../shared/audit/audit"
import { NotFoundError } from "../../../shared/errors/NotFoundError"

type OperationStatus = "OPEN" | "IN_PROGRESS" | "DONE" | "CANCELED"

interface CreateOperationInput {
  title: string
  description?: string
  unitId: string
  organizationId: string
  actorId: string
  ip?: string
}

export async function createOperation(input: CreateOperationInput) {
  const unit = await prisma.unit.findFirst({
    where: { id: input.unitId, organizationId: input.organizationId },
    select: { id: true },
  })

  if (!unit) {
    throw new NotFoundError("Unit not found")
  }

  const operation = await prisma.operation.create({
    data: {
      title: input.title,
      description: input.description,
      unitId: input.unitId,
      organizationId: input.organizationId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      unitId: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  await auditLog({
    action: "CREATE_OPERATION",
    entity: "Operation",
    entityId: operation.id,
    userId: input.actorId,
    ip: input.ip,
  })

  return operation
}

interface ListOperationInput {
  organizationId: string
  status?: OperationStatus
  unitId?: string
  page: number
  limit: number
}

export async function listOperations(input: ListOperationInput) {
  const skip = (input.page - 1) * input.limit

  const where = {
    organizationId: input.organizationId,
    ...(input.status ? { status: input.status } : {}),
    ...(input.unitId ? { unitId: input.unitId } : {}),
  }

  const [items, total] = await Promise.all([
    prisma.operation.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: input.limit,
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        unitId: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.operation.count({ where }),
  ])

  return {
    items,
    meta: {
      page: input.page,
      limit: input.limit,
      total,
      totalPages: Math.ceil(total / input.limit),
    },
  }
}

interface UpdateOperationStatusInput {
  id: string
  status: OperationStatus
  organizationId: string
  actorId: string
  ip?: string
}

export async function updateOperationStatus(input: UpdateOperationStatusInput) {
  const existing = await prisma.operation.findFirst({
    where: { id: input.id, organizationId: input.organizationId },
    select: { id: true },
  })

  if (!existing) {
    throw new NotFoundError("Operation not found")
  }

  const updated = await prisma.operation.update({
    where: { id: input.id },
    data: { status: input.status },
    select: {
      id: true,
      status: true,
      updatedAt: true,
    },
  })

  await auditLog({
    action: "UPDATE_OPERATION_STATUS",
    entity: "Operation",
    entityId: updated.id,
    userId: input.actorId,
    ip: input.ip,
  })

  return updated
}
