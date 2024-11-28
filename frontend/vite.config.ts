import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js', // PostCSS 설정 파일 경로
  },
  server: {
    port: 5173, // 개발 서버 포트
  }
})
