// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import csp from 'vite-plugin-csp-guard';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { ENABLE_CSP_IN_DEV_MODE, CSP_CONFIG_POLICY } from './config-overrides.js';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(),
    csp({
      dev: {
        run: ENABLE_CSP_IN_DEV_MODE ?? true, // Run the plugin in dev mode
      },
      policy: CSP_CONFIG_POLICY,
      build: {
        sri: true,
      },
    }),
  ],
  resolve: {
    alias: {
      src: '/src',
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:7071/api',
        secure: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
