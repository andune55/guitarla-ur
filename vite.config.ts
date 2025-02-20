import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  base: "https://andune55.github.io/guitarla-ur/",
  plugins: [react()],
})
