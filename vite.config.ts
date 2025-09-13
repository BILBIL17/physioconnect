import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // ✅ base disesuaikan: kalau build untuk GitHub Pages → pakai repo-name
  const base =
    mode === 'production' && process.env.GITHUB_PAGES === 'true'
      ? '/ConnectWithPhysio/' // <- ganti sesuai nama repo GitHub kamu
      : '/'

  return {
    base,
    plugins: [react()],

    server: {
      host: '0.0.0.0', // biar bisa diakses lewat IP LAN
      port: 5173
    },

    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
  }
})
