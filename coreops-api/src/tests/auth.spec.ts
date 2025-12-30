import request from "supertest"
import { describe, it, expect } from "vitest"
import { createTestServer } from "./helpers/createTestServer"

describe("Auth", async () => {
  const app = await createTestServer()

  it("should login with valid credentials", async () => {
    await request(app.server).post("/api/auth/register").send({
      organizationName: "Auth Org",
      adminName: "Admin",
      email: "auth@test.com",
      password: "123456",
    })

    const res = await request(app.server).post("/api/auth/login").send({
      email: "auth@test.com",
      password: "123456",
    })

    expect(res.status).toBe(200)
    expect(res.body.accessToken).toBeDefined()
  })
})
