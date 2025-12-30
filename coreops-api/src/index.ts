import { env } from "./infra/env"
import { buildApp } from "./server"

async function bootstrap() {
  const app = buildApp()

  try {
    await app.listen({
      port: Number(env.PORT),
      host: "0.0.0.0",
    })

    console.log(`🚀 Server running on port ${env.PORT}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

bootstrap()
