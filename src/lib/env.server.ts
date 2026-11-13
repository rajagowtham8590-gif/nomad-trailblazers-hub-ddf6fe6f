import fs from "node:fs";
import path from "node:path";

let cachedFileEnv: Record<string, string> | null = null;

function readEnvFile(): Record<string, string> {
  if (cachedFileEnv !== null) return cachedFileEnv;
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
  cachedFileEnv = result;
  return result;
}

/**
 * Universal environment variable reader for server-side code:
 * Checks process.env, VITE_ prefixed process.env, local .env file,
 * and falls back to an optional default value.
 */
export function getEnv(key: string, defaultValue = ""): string {
  if (typeof process !== "undefined" && process.env) {
    if (process.env[key] !== undefined && process.env[key] !== "") {
      return process.env[key]!;
    }
    const viteKey = `VITE_${key}`;
    if (process.env[viteKey] !== undefined && process.env[viteKey] !== "") {
      return process.env[viteKey]!;
    }
  }

  const fileEnv = readEnvFile();
  if (fileEnv[key] !== undefined && fileEnv[key] !== "") {
    return fileEnv[key];
  }
  const viteFileKey = `VITE_${key}`;
  if (fileEnv[viteFileKey] !== undefined && fileEnv[viteFileKey] !== "") {
    return fileEnv[viteFileKey];
  }

  return defaultValue;
}
