// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

function findAccessTokenInCache(tokenCache) {
  console.log(tokenCache);
  return undefined;
}

// Get a Key value store object and set its content in the local storage
async function setAuthDataInLocalStorage(tokenCache) {
  console.log('--setAuthDataInLocalStorage--');
  console.log('tokenCache');
  console.log(tokenCache);
  const cacheKeys = Object.keys(tokenCache);
  for (let key of cacheKeys) {
    const value = JSON.stringify(tokenCache[key]);
    window.localStorage.setItem(key, value);
  };
  // Set authentication method for @cosmotech/core
  window.localStorage.setItem('authAccessToken', findAccessTokenInCache(tokenCache));
  window.localStorage.setItem('authProvider', 'auth-dev');
}

module.exports = {
  setAuthDataInLocalStorage: setAuthDataInLocalStorage
};
