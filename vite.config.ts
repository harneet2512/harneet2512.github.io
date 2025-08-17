import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',              // user/organization site lives at domain root
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: { 
    outDir: 'dist', 
    assetsDir: 'assets',
    // Force single file output to avoid module loading issues
    rollupOptions: {
      output: {
        // Single file output to avoid MIME type issues
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    },
    // Disable source maps for production
    sourcemap: false,
    // Use esbuild for better compatibility
    minify: 'esbuild',
    // Target modern browsers
    target: 'es2015'
  },
  // Server configuration for development
  server: {
    port: 3000,
    host: true
  }
});
