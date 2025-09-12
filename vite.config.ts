import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  base: process.env.VITE_BASE_PATH,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
