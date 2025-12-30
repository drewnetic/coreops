import { buildApp } from "../src/app/server"

export async function createTestServer() {
  process.env.JWT_SECRET = "test-secret"

  const app = buildApp()
  await app.ready()

  return app
}
