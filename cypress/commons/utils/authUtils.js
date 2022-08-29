// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const jwt = require('jwt-simple');

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

export const authUtils = {
  decodeJWT,
  encodeJWT,
  forgeAccessTokenWithFakeRoles,
  forgeIdTokenWithFakeUser,
  getUserFromToken,
};
