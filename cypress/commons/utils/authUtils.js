// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const jwt = require('jwt-simple');

const USE_SERVICE_ACCOUNT = Cypress.env('AUTHENTICATE_WITH_SERVICE_ACCOUNT') === 1;

const decodeJWT = (token, secret = null) => jwt.decode(token, secret, secret === null);
const encodeJWT = (data, secret = 'dummy_secret') => jwt.encode(data, secret);

const forgeAccessTokenWithFakeRoles = (token, fakeRoles) => {
  const accessData = decodeJWT(token);
  accessData.roles = fakeRoles;
  return encodeJWT(accessData);
};

const forgeIdTokenWithFakeUser = (token, fakeUser) => {
  const idData = decodeJWT(token);
  idData.name = fakeUser?.name ?? idData.name;
  idData.oid = fakeUser?.id ?? idData.oid;
  idData.preferred_username = fakeUser?.email ?? idData.preferred_username;
  return encodeJWT(idData);
};

const getUserFromToken = (token) => {
  const idData = decodeJWT(token);
  return { email: idData.preferred_username, id: idData.oid, name: idData.name };
};

function _findAccessTokenFromMSALResponse(authResponse) {
  // Look for a "secret" key in the two objects returned by MSAL (its value will be the access token)
  for (const value of Object.values(authResponse)) {
    if ('secret' in value) {
      return value.secret;
    }
  }
  console.warn("Can't find access token from MSAL authentication response");
  return undefined;
}

// Reset provider & access token in local storage
async function resetAuthDataInLocalStorage() {
  window.localStorage.removeItem('authAccessToken');
  window.localStorage.removeItem('authProvider');
}

// Set provider & access token in local storage based on the content of the authentication response
async function setAuthDataInLocalStorage(authResponse) {
  window.localStorage.setItem('authAccessToken', _findAccessTokenFromMSALResponse(authResponse));
  window.localStorage.setItem('authProvider', 'auth-dev');
}

const fetchServiceAccountTokenIfEnabled = () => {
  if (USE_SERVICE_ACCOUNT && !window.localStorage.getItem('authAccessToken')) {
    cy.task('fetchServiceAccountToken').then((authResponse) => {
      setAuthDataInLocalStorage(authResponse);
    });
  } else {
    resetAuthDataInLocalStorage();
  }
};

export const authUtils = {
  USE_SERVICE_ACCOUNT,
  decodeJWT,
  encodeJWT,
  forgeAccessTokenWithFakeRoles,
  forgeIdTokenWithFakeUser,
  getUserFromToken,
  resetAuthDataInLocalStorage,
  setAuthDataInLocalStorage,
  fetchServiceAccountTokenIfEnabled,
};
