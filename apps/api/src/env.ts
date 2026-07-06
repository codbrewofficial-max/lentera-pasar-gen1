import { z } from "zod";

export const RUNTIME_MODES = ["development", "test", "production", "deployment"] as const;
export type RuntimeMode = (typeof RUNTIME_MODES)[number];

const runtimeMode = (process.env.APP_MODE || process.env.NODE_ENV || "development") as RuntimeMode;
const normalizedRuntimeMode: RuntimeMode = RUNTIME_MODES.includes(runtimeMode) ? runtimeMode : "development";

const toNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const toBoolean = (value: string | undefined, fallback = false) => {
  if (value == null || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
};

const toOrigins = (value: string | undefined) =>
  (value || "http://localhost:3000,http://localhost:3001")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const secretLooksWeak = (value: string | undefined) => {
  if (!value) return true;
  const normalized = value.toLowerCase();
  return (
    value.length < 32 ||
    normalized.includes("change-this") ||
    normalized.includes("dev-secret") ||
    normalized.includes("secret") ||
    normalized === "password" ||
    normalized === "changeme"
  );
};

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRES_IN: z.string().optional(),
  IP_HASH_SECRET: z.string().optional(),
  INTERNAL_API_KEY: z.string().optional(),
  CORS_ORIGIN: z.string().optional(),
  API_PORT: z.string().optional(),
  PORT: z.string().optional(),
  LOG_LEVEL: z.string().optional(),
  LOG_PRETTY: z.string().optional(),
  REQUEST_BODY_LIMIT_BYTES: z.string().optional(),
  TEMPLATE_UPLOAD_MAX_BYTES: z.string().optional(),
  BACKUP_MAX_BYTES: z.string().optional(),
  RATE_LIMIT_GLOBAL_MAX: z.string().optional(),
  RATE_LIMIT_AUTH_MAX: z.string().optional(),
  RATE_LIMIT_CONTACT_MAX: z.string().optional(),
  RATE_LIMIT_TRACKING_MAX: z.string().optional(),
  RATE_LIMIT_TEMPLATE_UPLOAD_MAX: z.string().optional(),
  RATE_LIMIT_BACKUP_MAX: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_SECURE: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  DASHBOARD_APP_URL: z.string().optional()
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success && normalizedRuntimeMode !== "test") {
  const missing = parsedEnv.error.issues.map((issue) => issue.path.join(".")).join(", ");
  throw new Error(`Invalid API environment. Missing/invalid keys: ${missing}`);
}

const rawEnv = parsedEnv.success ? parsedEnv.data : (process.env as z.infer<typeof envSchema>);
const productionLike = normalizedRuntimeMode === "production" || normalizedRuntimeMode === "deployment";
const corsOrigins = toOrigins(rawEnv.CORS_ORIGIN);

export const apiConfig = {
  runtimeMode: normalizedRuntimeMode,
  isProductionLike: productionLike,
  isDeploymentMode: normalizedRuntimeMode === "deployment",
  port: toNumber(rawEnv.API_PORT || rawEnv.PORT, 4000),
  jwtSecret: rawEnv.JWT_SECRET || "change-this-dev-secret",
  jwtExpiresIn: rawEnv.JWT_EXPIRES_IN || (productionLike ? "1d" : "7d"),
  ipHashSecret: rawEnv.IP_HASH_SECRET || rawEnv.JWT_SECRET || "change-this-ip-hash-secret",
  internalApiKey: rawEnv.INTERNAL_API_KEY || "",
  corsOrigins,
  allowAnyCorsOrigin: corsOrigins.includes("*"),
  logLevel: rawEnv.LOG_LEVEL || (productionLike ? "info" : "debug"),
  logPretty: toBoolean(rawEnv.LOG_PRETTY, !productionLike),
  requestBodyLimitBytes: toNumber(rawEnv.REQUEST_BODY_LIMIT_BYTES, 1024 * 1024),
  templateUploadMaxBytes: toNumber(rawEnv.TEMPLATE_UPLOAD_MAX_BYTES, 5 * 1024 * 1024),
  // Backup website berisi seluruh CRUD + file media, jadi limit-nya jauh lebih besar
  // dari upload media biasa. Default 100MB, bisa dinaikkan lewat env kalau media
  // website-nya banyak.
  backupMaxBytes: toNumber(rawEnv.BACKUP_MAX_BYTES, 100 * 1024 * 1024),
  maxParamLength: 500,
  dashboardAppUrl: (rawEnv.DASHBOARD_APP_URL || "http://localhost:3000").replace(/\/+$/, ""),
  smtp: {
    host: rawEnv.SMTP_HOST || "",
    port: toNumber(rawEnv.SMTP_PORT, 587),
    secure: toBoolean(rawEnv.SMTP_SECURE, false),
    user: rawEnv.SMTP_USER || "",
    password: rawEnv.SMTP_PASSWORD || "",
    from: rawEnv.SMTP_FROM || "Lentera Pasar <no-reply@lenterapasar.test>"
  },
  rateLimits: {
    global: { max: toNumber(rawEnv.RATE_LIMIT_GLOBAL_MAX, 180), timeWindow: "1 minute" },
    // Default lebih longgar di development/test supaya alur smoke test (register, verify,
    // resend, forgot/reset password, beberapa kali login) tidak kena limit sendiri di tengah
    // jalan. Production/deployment tetap ketat di 10/10 menit kecuali di-override eksplisit
    // lewat RATE_LIMIT_AUTH_MAX.
    auth: { max: toNumber(rawEnv.RATE_LIMIT_AUTH_MAX, productionLike ? 10 : 60), timeWindow: "10 minutes" },
    contact: { max: toNumber(rawEnv.RATE_LIMIT_CONTACT_MAX, 8), timeWindow: "10 minutes" },
    tracking: { max: toNumber(rawEnv.RATE_LIMIT_TRACKING_MAX, 120), timeWindow: "1 minute" },
    templateUpload: { max: toNumber(rawEnv.RATE_LIMIT_TEMPLATE_UPLOAD_MAX, 10), timeWindow: "1 hour" },
    // Backup/restore hanya bisa dipakai internal_admin dan operasinya berat (baca/tulis
    // banyak baris + file media), jadi dibatasi longgar tapi tetap ada supaya tidak
    // dipanggil berulang-ulang tanpa sengaja dari script/loop.
    backup: { max: toNumber(rawEnv.RATE_LIMIT_BACKUP_MAX, 20), timeWindow: "1 hour" }
  }
};

export const isOriginAllowed = (origin: string | undefined) => {
  if (!origin) return true;
  if (apiConfig.allowAnyCorsOrigin) return true;
  return apiConfig.corsOrigins.includes(origin);
};

export type DeploymentCheck = {
  key: string;
  ok: boolean;
  level: "error" | "warning";
  message: string;
};

export const getDeploymentChecks = (strict = false): DeploymentCheck[] => {
  const checks: DeploymentCheck[] = [];
  const add = (key: string, ok: boolean, level: "error" | "warning", message: string) => checks.push({ key, ok, level, message });

  add("DATABASE_URL", Boolean(rawEnv.DATABASE_URL), "error", "DATABASE_URL wajib tersedia.");
  add("JWT_SECRET", !secretLooksWeak(rawEnv.JWT_SECRET), "error", "JWT_SECRET wajib kuat, minimal 32 karakter, dan bukan secret development.");
  add("IP_HASH_SECRET", !secretLooksWeak(rawEnv.IP_HASH_SECRET || rawEnv.JWT_SECRET), "error", "IP_HASH_SECRET wajib kuat untuk hashing IP tracking/contact.");
  add("CORS_ORIGIN", Boolean(rawEnv.CORS_ORIGIN) && !corsOrigins.includes("*"), strict ? "error" : "warning", "CORS_ORIGIN production/deployment tidak boleh wildcard.");
  add("INTERNAL_API_KEY", !secretLooksWeak(rawEnv.INTERNAL_API_KEY), "error", "INTERNAL_API_KEY wajib kuat untuk endpoint deployment/internal server-to-server.");
  add("JWT_EXPIRES_IN", Boolean(apiConfig.jwtExpiresIn), "warning", "JWT_EXPIRES_IN sebaiknya di-set eksplisit, contoh 1d atau 7d.");
  add("SMTP_HOST", Boolean(rawEnv.SMTP_HOST), "warning", "SMTP_HOST belum di-set — email verifikasi dan reset password hanya akan tercatat di log server, tidak benar-benar terkirim.");

  if (!productionLike && !strict) {
    return checks.map((check) => (check.key === "INTERNAL_API_KEY" ? { ...check, level: "warning" } : check));
  }

  return checks;
};

export const assertRuntimeEnv = () => {
  if (!productionLike) return;
  const failed = getDeploymentChecks(true).filter((check) => !check.ok && check.level === "error");
  if (failed.length) {
    throw new Error(`Production/deployment environment is not safe: ${failed.map((check) => check.key).join(", ")}`);
  }
};