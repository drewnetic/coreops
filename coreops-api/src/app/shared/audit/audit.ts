import { prisma } from "../../../infra/database"

interface AuditInput {
  action: string
  entity: string
  entityId?: string
  userId: string
  ip?: string
}

export async function auditLog(data: AuditInput) {
  await prisma.auditLog.create({
    data: {
      action: data.action,
      entity: data.entity,
      entityId: data.entityId,
      userId: data.userId,
      ip: data.ip,
    },
  })
}
