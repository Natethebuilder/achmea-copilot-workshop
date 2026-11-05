import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/achmea-copilot-workshop/',
  server: { host: '127.0.0.1', port: 5217, strictPort: true },
})
