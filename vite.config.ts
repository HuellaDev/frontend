import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

import { VitePWA } from "vite-plugin-pwa";


export default defineConfig({
  plugins: [react(), tailwindcss(),
  VitePWA({
    strategies: "injectManifest",
    srcDir: "src",
    filename: "sw.ts",

    devOptions: {
      enabled: true,
      type: "module",
    },

    registerType: "autoUpdate",
    manifest: {
      name: "Huella",
      short_name: "Huella",
      theme_color: "#0f172a",
      background_color: "#ffffff",
      display: "standalone",
      icons: [
        {
          src: "/huella-icon-192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/huella-icon-512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
  }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});