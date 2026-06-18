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
        name: "Market POS Desktop App v3.2.0",
        short_name: "Mobile POS",
        description:
          "Native landscape terminal web client layout for Barista POS operations.",
        theme_color: "#0f0e0e", // Matches your layout's strong dark accent buttons
        background_color: "#cfd8e9", // Matches your global bg-gray-100 color tone
        display: "standalone", // Hides browser bars completely to feel like a real native app
        orientation: "any", // Forces layout flat horizontally on tablet mount displays
        start_url: "/login", // Directs users to the login page on app launch for quick access
        id: "market-pos-app", // Unique app ID (avoid using /login directly)
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-256.png", sizes: "256x256", type: "image/png" },
          { src: "/icon-384.png", sizes: "384x384", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "/512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable", // ensures safe cropping on Android
          },
        ],

        screenshots: [
          {
            src: "/dashboard.png",
            sizes: "1280x720",
            type: "image/png",
            form_factor: "wide",
          },
          {
            src: "/login.png",
            sizes: "1280x720",
            type: "image/png",
            form_factor: "wide",
          },
        ],
      },

      workbox: {
        // Caches all static framework code bundles and images automatically for instant offline operations
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg,woff2}"],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB, default is 10 MB
      },
    }),
  ],

  server: {
    port: 3000,
  },
});
