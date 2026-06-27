import crypto from "node:crypto";
import bcrypt from "bcryptjs";

export const hashPassword = (password: string) => bcrypt.hash(password, 10);
export const verifyPassword = (password: string, hash: string) => bcrypt.compare(password, hash);

export const randomToken = (prefix: string) => `${prefix}_${crypto.randomBytes(24).toString("hex")}`;

export const hashIp = (ip: string | undefined) => {
  if (!ip) return null;
  return crypto
    .createHmac("sha256", process.env.IP_HASH_SECRET || process.env.JWT_SECRET || "dev-secret")
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
