import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    base: 'https://joelhkv.github.io/Knowledge-Express/',
  plugins: [react()]
})
