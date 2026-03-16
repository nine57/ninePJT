import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    // allowedHosts: ['nine015.iptime.org', 'localhost'],
    allowedHosts: true // for dev
  },
})

