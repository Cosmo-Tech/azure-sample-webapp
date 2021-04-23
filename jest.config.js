// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

module.exports = {
  verbose: true,
  setupFiles: [
    './src/setupTests.js'
  ],
  moduleDirectories: [
    'node_modules',
    'src'
  ],
  setupFilesAfterEnv: ['./rtl.setup.js']
};
