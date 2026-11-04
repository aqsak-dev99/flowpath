import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In local development, /api requests go to the stand-in server (npm run dev:api).
const proxy = { '/api': 'http://localhost:3001' }

export default defineConfig({ plugins: [react()], server: { proxy }, preview: { proxy } })
