import type { FastifyReply } from "fastify";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details: unknown = {}
  ) {
    super(message);
  }
}

export const ok = (reply: FastifyReply, data: unknown, message = "OK", statusCode = 200) =>
  reply.code(statusCode).send({ data, message });

export const created = (reply: FastifyReply, data: unknown, message = "Created") =>
  ok(reply, data, message, 201);

export const fail = (
  reply: FastifyReply,
  statusCode: number,
  code: string,
  message: string,
  details: unknown = {}
) => reply.code(statusCode).send({ error: { code, message, details } });

export const toErrorPayload = (error: unknown) => {
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      body: { error: { code: error.code, message: error.message, details: error.details } }
    };
  }
  if (error instanceof ZodError) {
    return {
      statusCode: 422,
      body: {
        error: {
          code: "VALIDATION_ERROR",
          message: "Request validation failed",
          details: error.flatten()
        }
      }
    };
  }
  return {
    statusCode: 500,
    body: {
      error: {
        code: "INTERNAL_ERROR",
        message: process.env.NODE_ENV === "production" ? "Internal server error" : String(error),
        details: {}
      }
    }
  };
};

export const publicUser = <T extends { passwordHash?: string }>(user: T) => {
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
};
