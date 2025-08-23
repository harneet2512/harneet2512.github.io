import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  base: "/harneet2512.github.io/", // GitHub Pages repository name
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    minify: "esbuild",
    target: "es2015",
    rollupOptions: {
      output: {
        manualChunks: undefined,
        format: "iife",
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      },
    },
  },
  server: {
    port: 3000,
    host: true,
  },
});
