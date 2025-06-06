import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  base: './', // Relative paths for static assets
  build: {
    outDir: 'dist',
  },
  css: {
    postcss: './postcss.config.cjs',
  },
});