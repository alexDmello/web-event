import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Build-time image compression — runs on every file inside src/assets/ that
    // Vite processes. Files in /public are served verbatim (already WebP).
    ViteImageOptimizer({
      // WebP: quality 82 is visually lossless for photography at ~30-50% smaller
      webp: { quality: 82 },
      // JPEG: catch any stray JPEGs imported through src/assets
      jpg:  { quality: 80 },
      jpeg: { quality: 80 },
      // PNG: lossy compression for logo.png in src/assets (if imported)
      png:  { quality: 85 },
      // Log a size-comparison table after every build so you can track regressions
      logStats: true
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-core';
            }
          }
        }
      }
    }
  }
})
