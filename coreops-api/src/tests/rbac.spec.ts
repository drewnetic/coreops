import request from "supertest"
import { describe, it, expect } from "vitest"
import { createTestServer } from "./helpers/createTestServer"
import { createAdmin } from "./helpers/auth"

describe("RBAC", async () => {
  const app = await createTestServer()

  it("should allow admin to create users", async () => {
    const { token } = await createAdmin(app)

    const res = await request(app.server)
      .post("/api/users")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "User",
        email: "user@test.com",
        password: "123456",
        role: "USER",
      })

    expect(res.status).toBe(201)
    expect(res.body.email).toBe("user@test.com")
  })
})
