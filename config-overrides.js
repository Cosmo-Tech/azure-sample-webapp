const { override, addBabelPlugin } = require('customize-cra');
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');
const instanceViewData = require('./src/config/InstanceVisualization.js');

const extraConnectSources = [];
try {
  const azureFunctionHostname = new URL(instanceViewData.dataSource.functionUrl).hostname;
  console.debug(`CSP: parsed data source for instance view, adding connect-src: "${azureFunctionHostname}"`);
  extraConnectSources.push(azureFunctionHostname);
} catch {
  console.debug('CSP: data source for instance view not configured, skipping addition of specific connect-src...');
}

const cspConfigPolicy = {
  'default-src': "'none'",
  'base-uri': "'self'",
  'connect-src': [
    "'self'",
    'api.powerbi.com',
    '*.api.cosmotech.com',
    'https://login.microsoftonline.com',
    'https://dc.services.visualstudio.com',
  ].concat(extraConnectSources),
  'script-src': ["'self'"],
  'img-src': ["'self'", 'data:'],
  'style-src': ["'self'", "'unsafe-inline'"],
  'font-src': ['data:'],
  'frame-src': ['https://app.powerbi.com', 'https://login.microsoftonline.com'],
  'manifest-src': "'self'",
};

// Disable hashes and nonces for scripts and styles
const cspConfigOptions = {
  hashEnabled: {
    'script-src': true,
    'style-src': false,
  },
  nonceEnabled: {
    'script-src': false,
    'style-src': false,
  },
};

function addCspHtmlWebpackPlugin(config) {
  if (process.env.NODE_ENV === 'production') {
    config.plugins.push(new CspHtmlWebpackPlugin(cspConfigPolicy, cspConfigOptions));
  }

  return config;
}

module.exports = override(
  addCspHtmlWebpackPlugin,
  addBabelPlugin('@babel/plugin-proposal-logical-assignment-operators')
);
