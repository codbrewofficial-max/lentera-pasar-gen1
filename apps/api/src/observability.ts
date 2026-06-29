import type { FastifyInstance } from "fastify";
import { apiConfig } from "./env.js";

export const loggerConfig =
  apiConfig.logLevel === "silent"
    ? false
    : {
        level: apiConfig.logLevel,
        redact: {
          paths: [
            "req.headers.authorization",
            "req.headers.cookie",
            "req.headers['x-lentera-api-key']",
            "request.headers.authorization",
            "request.headers.cookie",
            "request.headers['x-lentera-api-key']",
            "body.password",
            "body.passwordHash",
            "*.password",
            "*.passwordHash"
          ],
          censor: "[redacted]"
        }
      };

export const registerObservabilityHooks = (app: FastifyInstance) => {
  app.addHook("onRequest", async (request, reply) => {
    reply.header("x-request-id", request.id);
  });

  app.addHook("onResponse", async (request, reply) => {
    request.log.info(
      {
        requestId: request.id,
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
        responseTimeMs: Math.round(reply.elapsedTime)
      },
      "request_completed"
    );
  });
};

export const safeServerInfo = () => ({
  status: "ok",
  runtimeMode: apiConfig.runtimeMode,
  uptimeSeconds: Math.round(process.uptime()),
  timestamp: new Date().toISOString()
});
