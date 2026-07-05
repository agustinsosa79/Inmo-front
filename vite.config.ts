import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Si ya tienes 'host: "0.0.0.0"' déjalo ahí
    allowedHosts: [
      "bl1uqf-ip-186-137-18-134.tunnelmole.net"
    ]
  },
})



