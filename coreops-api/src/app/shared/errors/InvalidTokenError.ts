import { AppError } from "./AppError"

export class InvalidTokenError extends AppError {
  constructor(message = "Invalid token") {
    super(message, 401)
  }
}
