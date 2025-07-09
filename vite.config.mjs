// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [react(), nodePolyfills()],
  resolve: {
    alias: {
      src: '/src',
    },
  },
  server: {
    port: 3000,
  },
});
