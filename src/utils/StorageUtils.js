// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const ACCESS_TOKEN_LOCAL_STORAGE_KEY = 'authAccessToken';

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
