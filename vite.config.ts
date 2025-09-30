/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true, // allow global test/expect syntax
    environment: 'jsdom', // provide DOM for tests
    setupFiles: './src/tests/setup.ts', // setup file for jest-dom, etc.
  },
})
