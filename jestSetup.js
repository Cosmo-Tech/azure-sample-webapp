// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import '@testing-library/jest-dom';

Object.defineProperty(window, 'crypto', {
  value: {
    getRandomValues: (arr) => new Uint32Array(arr.length),
  },
});
