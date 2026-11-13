import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

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

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      {
        name: "php-dev-handler",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const pathname = req.url?.split("?")[0];
            if (pathname === "/send-mail.php") {
              const scriptPath = path.resolve(process.cwd(), "public/send-mail.php");
              if (!fs.existsSync(scriptPath)) {
                res.statusCode = 404;
                res.end(JSON.stringify({ ok: false, error: "send-mail.php not found" }));
                return;
              }

              let body = "";
              req.on("data", (chunk) => {
                body += chunk;
              });

              req.on("end", () => {
                const phpBinary = findPhpBinary();
                const php = spawn(phpBinary, [scriptPath], {
                  env: {
                    ...process.env,
                    REQUEST_METHOD: req.method || "POST",
                    CONTENT_TYPE: req.headers["content-type"] || "application/json",
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
                  res.setHeader("Content-Type", "application/json; charset=UTF-8");
                  const jsonStart = stdout.indexOf("{");
                  const jsonEnd = stdout.lastIndexOf("}");
                  if (jsonStart !== -1 && jsonEnd !== -1) {
                    res.statusCode = 200;
                    res.end(stdout.slice(jsonStart, jsonEnd + 1));
                  } else {
                    res.statusCode = code === 0 ? 200 : 500;
                    res.end(JSON.stringify({ ok: code === 0, output: stdout, error: stderr }));
                  }
                });

                php.stdin.write(body);
                php.stdin.end();
              });
              return;
            }
            next();
          });
        },
      },
    ],
  },
});
