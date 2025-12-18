// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import '@testing-library/jest-dom';

jest.mock('src/services/config/EnvironmentVariables.js', () => ({ ENV: {} }));

Object.defineProperty(window, 'crypto', {
  value: {
    getRandomValues: (arr) => new Uint32Array(arr.length),
    subtle: {},
  },
});

// Work-around for "ReferenceError: TextEncoder is not defined" after replacing react-router-dom v6 by react-router v7
// Source: https://github.com/remix-run/react-router/blob/7.6.2/packages/react-router/__tests__/setup.ts#L4-L8
if (!globalThis.TextEncoder || !globalThis.TextDecoder) {
  const { TextDecoder, TextEncoder } = require('node:util');
  globalThis.TextEncoder = TextEncoder;
  globalThis.TextDecoder = TextDecoder;
}
