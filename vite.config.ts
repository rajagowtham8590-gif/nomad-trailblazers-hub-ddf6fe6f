// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const isVercel = Boolean(process.env.VERCEL) || process.env.NITRO_PRESET === "vercel";

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
export default defineConfig({
  ...(isVercel ? { nitro: { preset: "vercel" } } : {}),
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(
        process.env.VITE_SUPABASE_URL ||
          process.env.SUPABASE_URL ||
          "https://c--fd513ce2-a33c-42d7-b96b-e3c670b402ff-prod.lovable.cloud"
      ),
      "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(
        process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
          process.env.SUPABASE_PUBLISHABLE_KEY ||
          "sb_publishable_DK9GBivH5TbaNvr-nTeJXg_dhNE01L5"
      ),
    },
    plugins: [
      {
        name: "fix-vite7-rollup-input",
        config() {
          return {
            build: {
              rollupOptions: {
                input: {
                  index: "virtual:tanstack-start-client-entry",
                },
              },
            },
            environments: {
              client: {
                build: {
                  rollupOptions: {
                    input: {
                      index: "virtual:tanstack-start-client-entry",
                    },
                  },
                },
              },
            },
          };
        },
      },
    ],
  },
});
