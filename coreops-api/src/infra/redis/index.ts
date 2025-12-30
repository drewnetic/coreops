import Redis from "ioredis"

export const redis =
  process.env.NODE_ENV === "test"
    ? new Redis({ host: "127.0.0.1", port: 6379, lazyConnect: true })
    : new Redis()
