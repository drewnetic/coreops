import jwt from "jsonwebtoken"
import { env } from "../../../infra/env"

export function signAccessToken(payload: {
  sub: string
  role: string
  organizationId: string
}) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "15m",
  })
}

export function signRefreshToken(payload: { sub: string }) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "7d",
  })
}

export function verifyToken<T>(token: string): T {
  return jwt.verify(token, env.JWT_SECRET) as T
}
