import request from "supertest"
import { describe, expect, it } from "vitest"
import { createAdmin } from "./helpers/auth"
import { createTestServer } from "./helpers/createTestServer"

describe("Operations", async () => {
  const app = await createTestServer()

  it("should create an operation linked to a unit", async () => {
    const { token } = await createAdmin(app)

    const unitRes = await request(app.server)
      .post("/api/units")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Main Unit" })

    expect(unitRes.status).toBe(201)

    const unitId = unitRes.body.id

    const res = await request(app.server)
      .post("/api/operations")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Air conditioning broken",
        unitId,
      })

    expect(res.status).toBe(201)
    expect(res.body.unitId).toBe(unitId)
  })
})
