import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// GitHub Pages serves this repo at https://<user>.github.io/kera.web/
export default defineConfig({
  base: '/kera.web/',
  plugins: [react(), tailwindcss()],
})
