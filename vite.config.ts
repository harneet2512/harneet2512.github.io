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
    // Ensure proper module handling
    rollupOptions: {
      output: {
        // Use consistent naming for better caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Disable source maps for production
    sourcemap: false,
    // Ensure proper minification
    minify: 'terser'
  },
  // Server configuration for development
  server: {
    port: 3000,
    host: true
  }
});
