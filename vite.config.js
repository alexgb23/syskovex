import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // 🔧 Plugin para preload automático de CSS crítico
    {
      name: "preload-css",
      transformIndexHtml(html, { filename }) {
        return html.replace(
          /(<link rel="stylesheet" href="\/assets\/[^"]+\.css"\/?>)/i,
          '<link rel="preload" as="style" href="$1" onload="this.rel=\'stylesheet\'" />$1',
        );
      },
    },
  ],
  server: {
    watch: {
      usePolling: true, // 👈 Obliga a Vite a vigilar activamente los cambios de archivos
      interval: 100, // Revisa cambios cada 100ms para que sea instantáneo
    },
  },
  build: {
    // 🔧 Optimizar carga de CSS
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
