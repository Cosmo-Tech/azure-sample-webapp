// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const localStorageMock = (store = {}) => {
  let mockStore = store;

  return {
    getItem(key) {
      return mockStore[key];
    },

    setItem(key, value) {
      mockStore[key] = value;
    },

    clear() {
      mockStore = {};
    },

    removeItem(key) {
      delete mockStore[key];
    },

    getAll() {
      return mockStore;
    },
  };
};
