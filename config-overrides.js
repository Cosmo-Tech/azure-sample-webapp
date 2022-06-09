const { override } = require('customize-cra');
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');

const cspConfigPolicy = {
  'default-src': "'none'",
  'base-uri': "'self'",
  'connect-src': [
    "'self'",
    'api.powerbi.com',
    '*.api.cosmotech.com',
    'https://login.microsoftonline.com',
    'https://dc.services.visualstudio.com',
  ],
  'script-src': ["'self'"],
  'img-src': ["'self'", 'data:'],
  'style-src': ["'self'", "'unsafe-inline'"],
  'font-src': ['data:'],
  'frame-src': 'https://app.powerbi.com',
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

module.exports = {
  webpack: override(addCspHtmlWebpackPlugin),
};
