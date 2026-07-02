import type { FastifyRequest, FastifyReply } from "fastify";
import { ZodError } from "zod";
import { apiConfig } from "./env.js";

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

const safeInternalMessage = (error: unknown) => {
  if (apiConfig.isProductionLike) return "Internal server error";
  if (error instanceof Error) return error.message;
  return String(error);
};

export const toErrorPayload = (error: unknown, request?: FastifyRequest) => {
  const requestId = request?.id;
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      body: { error: { code: error.code, message: error.message, details: error.details, requestId } }
    };
  }
  if (error instanceof ZodError) {
    return {
      statusCode: 422,
      body: {
        error: {
          code: "VALIDATION_ERROR",
          message: "Request validation failed",
          details: error.flatten(),
          requestId
        }
      }
    };
  }
  // @fastify/rate-limit melempar error biasa (bukan AppError) dengan statusCode 429.
  // Tanpa ini, error rate-limit yang sah malah nyamar jadi 500 INTERNAL_ERROR dan
  // menyembunyikan penyebab aslinya dari pemakai API.
  const maybeStatusCode = (error as { statusCode?: number })?.statusCode;
  if (maybeStatusCode === 429) {
    return {
      statusCode: 429,
      body: {
        error: {
          code: "RATE_LIMIT_EXCEEDED",
          message: error instanceof Error ? error.message : "Too many requests",
          details: {},
          requestId
        }
      }
    };
  }
  return {
    statusCode: 500,
    body: {
      error: {
        code: "INTERNAL_ERROR",
        message: safeInternalMessage(error),
        details: {},
        requestId
      }
    }
  };
};

export const publicUser = <T extends {
  passwordHash?: string;
  emailVerificationTokenHash?: string | null;
  passwordResetTokenHash?: string | null;
}>(user: T) => {
  const { passwordHash: _passwordHash, emailVerificationTokenHash: _evth, passwordResetTokenHash: _prth, ...safeUser } = user;
  return safeUser;
};