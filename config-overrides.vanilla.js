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
  const isProd = process.env.NODE_ENV === 'production';
  const isUniversal = process.env.BUILD_TYPE === 'universal';
  // When "universal" build mode is enabled, do not add CSP at build time
  if (isProd && !isUniversal) {
    config.plugins.push(new CspHtmlWebpackPlugin(cspConfigPolicy, cspConfigOptions));
  }

  return config;
}

function addFallback(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    stream: require.resolve('stream-browserify'),
  });
  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
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
