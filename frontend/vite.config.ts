import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  css: {
    postcss: './postcss.config.cjs', // PostCSS 설정 파일 경로
  },
  server: {
    port: 5173, // 개발 서버 포트
  }
})
