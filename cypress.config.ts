import { defineConfig } from 'cypress';

export default defineConfig({
  numTestsKeptInMemory: 0,
  video: false,
  watchForFileChanges: false,
  requestTimeout: 60000,
  responseTimeout: 60000,
  viewportWidth: 1920,
  viewportHeight: 966,
  modifyObstructiveCode: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config);
    },
    baseUrl: 'http://localhost:3000',
  },
  expose: {
    AUTHENTICATE_WITH_API_KEY: process.env.CYPRESS_AUTHENTICATE_WITH_API_KEY,
    AUTHENTICATE_WITH_SERVICE_ACCOUNT: process.env.CYPRESS_AUTHENTICATE_WITH_SERVICE_ACCOUNT,
    WORKSPACE_ID1: process.env.CYPRESS_WORKSPACE_ID1,
    WORKSPACE_ID2: process.env.CYPRESS_WORKSPACE_ID2,
    BASE_URL: process.env.CYPRESS_BASE_URL,
    COSMO_API_URL: process.env.CYPRESS_COSMO_API_URL,
  },
});
