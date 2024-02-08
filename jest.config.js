// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

module.exports = {
  testMatch: ['<rootDir>/src/**/*.spec.js'],
  moduleNameMapper: {
    '\\.(css|scss|less|png)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.js?$': 'babel-jest',
  },
  testEnvironment: 'jest-environment-jsdom',
  setupFiles: ['jest-canvas-mock'],
  setupFilesAfterEnv: ['<rootDir>/jestSetup.js'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.js'],
  coverageDirectory: '<rootDir>/coverage/',
  coverageReporters: ['lcov', 'text-summary'],
};
