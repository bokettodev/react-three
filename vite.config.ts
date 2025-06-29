import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      includeAssets: ["vite.svg", ".nojekyll"],
      manifest: {
        name: "3D Geometric Shapes Collection",
        short_name: "3D Shapes",
        description: "Interactive 3D shapes collection with Three.js",
        theme_color: "#000000",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "any",
        scope: "/react-three/",
        start_url: "/react-three/",
        id: "/react-three/",
        categories: ["education", "graphics"],
        lang: "ru",
        icons: [
          {
            src: "vite.svg",
            sizes: "72x72",
            type: "image/svg+xml",
            purpose: "any",
          },
          {
            src: "vite.svg",
            sizes: "96x96",
            type: "image/svg+xml",
            purpose: "any",
          },
          {
            src: "vite.svg",
            sizes: "128x128",
            type: "image/svg+xml",
            purpose: "any",
          },
          {
            src: "vite.svg",
            sizes: "144x144",
            type: "image/svg+xml",
            purpose: "any",
          },
          {
            src: "vite.svg",
            sizes: "152x152",
            type: "image/svg+xml",
            purpose: "any",
          },
          {
            src: "vite.svg",
            sizes: "180x180",
            type: "image/svg+xml",
            purpose: "apple-touch-icon",
          },
          {
            src: "vite.svg",
            sizes: "192x192",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
          {
            src: "vite.svg",
            sizes: "384x384",
            type: "image/svg+xml",
            purpose: "any",
          },
          {
            src: "vite.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  base: "/react-three/",
  publicDir: "public",
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@pages": "/src/pages",
      "@store": "/src/store",
      "@types": "/src/types",
      "@hooks": "/src/hooks",
      "@utils": "/src/utils",
      "@constants": "/src/constants",
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    target: ["es2015", "safari11"],
    rollupOptions: {
      input: {
        main: "./index.html",
      },
      output: {
        format: "es",
        manualChunks: {
          vendor: ["react", "react-dom"],
          three: ["three", "@react-three/fiber", "@react-three/drei"],
        },
      },
    },
  },
  server: {
    port: 3000,
    host: true,
  },
});
