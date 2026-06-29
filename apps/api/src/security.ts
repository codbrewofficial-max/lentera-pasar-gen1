import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { apiConfig } from "./env.js";

export const hashPassword = (password: string) => bcrypt.hash(password, 10);
export const verifyPassword = (password: string, hash: string) => bcrypt.compare(password, hash);

export const randomToken = (prefix: string) => `${prefix}_${crypto.randomBytes(24).toString("hex")}`;

export const hashIp = (ip: string | undefined) => {
  if (!ip) return null;
  return crypto
    .createHmac("sha256", apiConfig.ipHashSecret)
    .update(ip)
    .digest("hex");
};

export const limitJson = (value: unknown, maxBytes = 4096) => {
  if (value == null) return null;
  const serialized = JSON.stringify(value);
  if (Buffer.byteLength(serialized, "utf8") > maxBytes) {
    return { truncated: true };
  }
  return value;
};

export const prismaJson = (value: unknown) => (value == null ? undefined : (value as any));


export const verifyApiKey = (provided: unknown, expected = apiConfig.internalApiKey) => {
  if (!expected || typeof provided !== "string" || !provided) return false;
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  if (providedBuffer.length !== expectedBuffer.length) return false;
  return crypto.timingSafeEqual(providedBuffer, expectedBuffer);
};
