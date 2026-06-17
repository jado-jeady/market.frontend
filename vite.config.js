import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate", // Automatically patches layout files in background
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "Market POS App",
        short_name: "POS Mobile App",
        description:
          "Native landscape terminal web client layout for Barista POS operations.",
        theme_color: "#000000", // Matches your layout's strong dark accent buttons
        background_color: "#f3f4f6", // Matches your global bg-gray-100 color tone
        display: "standalone", // Hides browser bars completely to feel like a real native app
        orientation: "landscape", // Forces layout flat horizontally on tablet mount displays
        start_url: "/login", // Directs users to the login page on app launch for quick access
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-256.png", sizes: "256x256", type: "image/png" },
          { src: "/icon-384.png", sizes: "384x384", type: "image/png" },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        // Caches all static framework code bundles and images automatically for instant offline operations
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg,woff2}"],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
      },
    }),
  ],

  server: {
    port: 3000,
  },
});
