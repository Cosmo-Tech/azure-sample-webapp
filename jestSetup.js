// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import '@testing-library/jest-dom';

jest.mock('@mui/styles/makeStyles', () => () => () => ({}));
jest.mock('@mui/styles/withStyles', () => () => () => ({}));
jest.mock('src/services/config/EnvironmentVariables.js', () => ({ ENV: {} }));

Object.defineProperty(window, 'crypto', {
  value: {
    getRandomValues: (arr) => new Uint32Array(arr.length),
    subtle: {},
  },
});
