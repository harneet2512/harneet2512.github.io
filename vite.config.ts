import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: 8080,
    host: true,
  },
  build: {
    // Split long-lived vendor code into its own cacheable chunks so the
    // browser can download them in parallel and keep them across deploys
    // (app code changes far more often than these libraries).
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (/[\\/]react(-dom)?[\\/]|[\\/]scheduler[\\/]/.test(id)) return "react-vendor";
          if (/[\\/](motion|framer-motion|motion-dom)[\\/]/.test(id)) return "motion";
          if (/[\\/](ai|@ai-sdk)[\\/]/.test(id)) return "ai-vendor";
          if (/[\\/]@radix-ui[\\/]/.test(id)) return "radix";
          if (/[\\/]@tanstack[\\/]/.test(id)) return "tanstack";
        },
      },
    },
  },
  plugins: [
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart({ spa: { enabled: true } }),
    nitro(),
    viteReact(),
  ],
});
