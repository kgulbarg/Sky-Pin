import { defineConfig, loadEnv } from "vite";
import path from "path";
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, "../.."), "");
  console.log("Loaded environment variables:", env);
  return {
    plugins: [react()],
    define: {
      __BACKEND_PORT__: JSON.stringify(env.BACKEND_PORT),
    },
  };
});