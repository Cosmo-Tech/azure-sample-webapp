// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://127.0.0.1:7071',
      secure: false,
      changeOrigin: true
    })
  );
};
