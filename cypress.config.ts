import { defineConfig } from 'cypress';

export default defineConfig({
  experimentalMemoryManagement: true,
  numTestsKeptInMemory: 0,
  video: false,
  watchForFileChanges: false,
  requestTimeout: 60000,
  responseTimeout: 60000,
  viewportWidth: 1920,
  viewportHeight: 966,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        // TODO: find how to set Firefox language to French
        if (browser.family === 'chromium' && browser.name !== 'electron') {
          launchOptions.preferences.default.intl = { accept_languages: 'fr' };
          return launchOptions;
        }
      });

      return require('./cypress/plugins/index.js')(on, config);
    },
    baseUrl: 'http://localhost:3000',
  },
});
