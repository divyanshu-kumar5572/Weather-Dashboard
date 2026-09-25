// client/vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // We add a `server` configuration block here.
  server: {
    // The `proxy` option is where we configure our forwarding rules.
    proxy: {
      // This rule says: any request that starts with `/api`
      // should be forwarded to our backend server.
      '/api': {
        // The target is the address of our backend Express server.
        target: 'http://localhost:5000',
        // `changeOrigin: true` is a crucial option. It changes the `Host` header
        // of the request to match the target's origin. This is necessary for
        // some servers and a good practice to include.
        changeOrigin: true,
      },
    }
  },
  plugins: [react()],
})