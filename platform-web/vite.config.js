import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174 // Use port 5174 to avoid conflict with existing web-pos-nit on default 5173
  }
})
