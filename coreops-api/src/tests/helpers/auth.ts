import request from "supertest"

export async function createAdmin(app: any) {
  const email = `admin-${crypto.randomUUID()}@test.com`

  await request(app.server).post("/api/auth/register").send({
    organizationName: "Test Org",
    adminName: "Admin",
    email,
    password: "123456",
  })

  const login = await request(app.server).post("/api/auth/login").send({
    email,
    password: "123456",
  })

  return {
    token: login.body.accessToken,
  }
}
