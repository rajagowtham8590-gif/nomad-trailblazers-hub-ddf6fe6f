import fs from "node:fs";
import path from "node:path";

function readEnvFile(): Record<string, string> {
  const result: Record<string, string> = {};
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          result[key] = val;
        }
      }
    }
  } catch {
    // Ignore read errors in sandboxed or serverless environments
  }
  return result;
}

/**
 * Universal environment variable reader:
 * 1. Checks local .env file (takes precedence in local dev so changes are immediate)
 * 2. Checks process.env & VITE_ prefixed env (used on Vercel / serverless runtimes)
 * 3. Falls back to default value
 */
export function getEnv(key: string, defaultValue = ""): string {
  // 1. Local .env file
  const fileEnv = readEnvFile();
  if (fileEnv[key] !== undefined && fileEnv[key] !== "") {
    return fileEnv[key];
  }
  const viteFileKey = `VITE_${key}`;
  if (fileEnv[viteFileKey] !== undefined && fileEnv[viteFileKey] !== "") {
    return fileEnv[viteFileKey];
  }

  // 2. System / Vercel process.env
  if (typeof process !== "undefined" && process.env) {
    if (process.env[key] !== undefined && process.env[key] !== "") {
      return process.env[key]!;
    }
    const viteKey = `VITE_${key}`;
    if (process.env[viteKey] !== undefined && process.env[viteKey] !== "") {
      return process.env[viteKey]!;
    }
  }

  return defaultValue;
}

