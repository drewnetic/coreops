import Fastify from "fastify";

export const app = Fastify({
  logger: true,
});

export async function startServer() {
  try {
    await app.listen({ port: 3333, host: "0.0.0.0" });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}
