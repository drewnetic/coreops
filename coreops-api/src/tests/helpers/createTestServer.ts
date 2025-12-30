// tests/helpers/createTestServer.ts
import { buildApp } from "../../app/server"

let app: any

export async function createTestServer() {
  if (app) return app

  app = buildApp()
  await app.ready()

  return app
}
