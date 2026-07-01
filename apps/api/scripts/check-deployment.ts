import "dotenv/config";
import { apiConfig, getDeploymentChecks } from "../src/env.js";

const checks = getDeploymentChecks(true);
const errors = checks.filter((check) => !check.ok && check.level === "error");
const warnings = checks.filter((check) => !check.ok && check.level === "warning");

console.log("\nLentera Pasar API deployment check");
console.log("-----------------------------------");
console.log(`Mode          : ${apiConfig.runtimeMode}`);
console.log(`Port          : ${apiConfig.port}`);
console.log(`CORS origins  : ${apiConfig.corsOrigins.join(", ") || "-"}`);
console.log(`JWT expires in: ${apiConfig.jwtExpiresIn}`);
console.log(`Log level     : ${apiConfig.logLevel}`);
console.log("");

for (const check of checks) {
  const mark = check.ok ? "PASS" : check.level === "error" ? "FAIL" : "WARN";
  console.log(`[${mark}] ${check.key} - ${check.message}`);
}

if (warnings.length) {
  console.log(`\nWarnings: ${warnings.length}`);
}

if (errors.length) {
  console.error(`\nDeployment check failed with ${errors.length} error(s).`);
  process.exit(1);
}

console.log("\nDeployment check passed.");
