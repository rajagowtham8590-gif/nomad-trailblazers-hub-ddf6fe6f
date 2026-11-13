import { spawn } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

function findPhpBinary(): string {
  const candidates = [
    "C:\\xampp\\php\\php.exe",
    "C:\\laragon\\bin\\php\\php.exe",
    "C:\\wamp64\\bin\\php\\php.exe",
    "php",
  ];
  for (const candidate of candidates) {
    if (candidate === "php" || fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return "php";
}

export function executePhpMailer(data: {
  formType: string;
  payload: Record<string, unknown>;
  website?: string;
}): Promise<{ ok: boolean; mail_sent?: boolean; errors?: Array<{ field: string; message: string }> }> {
  return new Promise((resolve) => {
    const phpBinary = findPhpBinary();
    const scriptPath = path.resolve(process.cwd(), "public/send-mail.php");

    if (!fs.existsSync(scriptPath)) {
      console.warn("[PHP Mailer] public/send-mail.php not found");
      return resolve({ ok: true });
    }

    try {
      const php = spawn(phpBinary, [scriptPath], {
        env: {
          ...process.env,
          SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || "rajagowtham8590@gmail.com",
        },
      });

      let stdout = "";
      let stderr = "";

      php.stdout.on("data", (chunk) => {
        stdout += chunk.toString();
      });

      php.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });

      php.on("close", (code) => {
        try {
          const jsonStart = stdout.indexOf("{");
          const jsonEnd = stdout.lastIndexOf("}");
          if (jsonStart !== -1 && jsonEnd !== -1) {
            const parsed = JSON.parse(stdout.slice(jsonStart, jsonEnd + 1));
            return resolve(parsed);
          }
          resolve({ ok: code === 0 });
        } catch {
          resolve({ ok: code === 0 });
        }
      });

      php.on("error", (err) => {
        console.warn("[PHP Mailer] Failed to invoke PHP:", err.message);
        resolve({ ok: true });
      });

      php.stdin.write(JSON.stringify(data));
      php.stdin.end();
    } catch (err) {
      console.warn("[PHP Mailer] Error executing PHP:", err);
      resolve({ ok: true });
    }
  });
}
