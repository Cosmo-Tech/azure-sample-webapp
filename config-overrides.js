const { override } = require('customize-cra');
const webpack = require('webpack');
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
  'frame-src': ["'self'", 'blob:', 'https://app.powerbi.com', 'https://login.microsoftonline.com'],
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

function addFallback(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    assert: require.resolve('assert'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify'),
    url: require.resolve('url'),
  });
  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ]);
  return config;
}

function addSplitChunks(config) {
  if (process.env.NODE_ENV !== 'production') {
    return config;
  }

  config.optimization.splitChunks = {
    chunks: 'all',
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name(module) {
          const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

          // npm package names are URL-safe, but some servers don't like @ symbols
          return `npm.${packageName.replace('@', '')}`;
        },
      },
    },
  };

  return config;
}

module.exports = override(addCspHtmlWebpackPlugin, addFallback, addSplitChunks);
