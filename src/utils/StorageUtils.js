// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const ACCESS_TOKEN_LOCAL_STORAGE_KEY = 'authAccessToken';

/* export const getAccessToken = async () => {
  // Get current auth access token
  let authAccessToken = readFromStorage(ACCESS_TOKEN_LOCAL_STORAGE_KEY);
  console.log('getAccessToken');
  console.log(authAccessToken);
  // If token defined, check if expired
  if (authAccessToken !== null) {
    // Get token expiration time (seconds since Unix epoch)
    const exp = jsonwebtoken.decode(authAccessToken).exp;

    // Get current time (seconds since Unix epoch)
    const secondsSinceEpoch = Math.round(Date.now() / 1000);
    console.log('getAccessToken');
    console.log(secondsSinceEpoch);
    console.log(exp);
    console.log('getAccessToken');
    // If token is expired, try to get a new token with
    // MSAL acquireTokenSilent() function (called from isUserSignedIn())
    if (secondsSinceEpoch > exp) {
      await Auth.isUserSignedIn();
      // Get the new token
      authAccessToken = localStorage.getItem('authAccessToken');
      console.log('New token');
      console.log(authAccessToken);
    }
  }
  return authAccessToken;
}; */

export const getAccessToken = () => readFromStorage(ACCESS_TOKEN_LOCAL_STORAGE_KEY);

// Functions to read & write from storage.
// Notes : local storage works on Chromium but not on Firefox if "Delete
// cookies and site data when Firefox is closed" is selected (for more
// details, see https://bugzilla.mozilla.org/show_bug.cgi?id=1453699)
export function writeToStorage (key, value) {
  localStorage.setItem(key, value);
}

export function readFromStorage (key) {
  return localStorage.getItem(key);
}

export function clearFromStorage (key) {
  localStorage.removeItem(key);
}
