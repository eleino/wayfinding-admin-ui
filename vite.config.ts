/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import babel from "@rolldown/plugin-babel";
import { playwright } from "@vitest/browser-playwright";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "APP_");
  return {
    base: env.APP_BASE || "/",
    plugins: [
      react(),
      babel({
        presets: [reactCompilerPreset()],
      }),
      tailwindcss(),
    ],
    resolve: {
      tsconfigPaths: true,
    },
    server: {
      port: 5172,
      proxy: {
        "/api": "http://localhost:3000",
      },
    },
    test: {
      globals: true,
      projects: [
        {
          extends: true,
          test: {
            name: "unit",
            include: ["src/**/*.test.ts"],
            environment: "node",
          },
        },
        {
          extends: true,
          test: {
            name: "browser",
            include: ["src/**/*.test.tsx"],
            setupFiles: "./src/test/setup.ts",
            browser: {
              enabled: true,
              headless: true,
              provider: playwright(),
              api: {
                host: "127.0.0.1",
                port: 4174,
              },
              instances: [{ browser: "chromium" }],
            },
          },
        },
      ],
    },
  };
});
