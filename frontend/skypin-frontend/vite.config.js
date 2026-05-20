import { defineConfig, loadEnv } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const configDir = path.dirname(fileURLToPath(import.meta.url));
  const env = loadEnv(mode, path.resolve(configDir, "../.."), "BACKEND_PORT");
  const backendPort = env.BACKEND_PORT || "3000";

  return {
    plugins: [react()],
    define: {
      __BACKEND_PORT__: JSON.stringify(backendPort),
    },
  };
});
