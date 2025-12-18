import bcrypt from "bcryptjs"
import { prisma } from "../../../../infra/database"

export async function registerOrganizationAdmin(
  organizationName: string,
  adminName: string,
  email: string,
  password: string,
) {
  const emailExists = await prisma.user.findUnique({
    where: { email },
  })

  if (emailExists) {
    throw new Error("Email already in use")
  }

  const passwordHash = await bcrypt.hash(password, 10)
  return prisma.organization.create({
    data: {
      name: organizationName,
      users: {
        create: {
          name: adminName,
          email,
          passwordHash,
          role: "ADMIN",
        },
      },
    },
  })
}
