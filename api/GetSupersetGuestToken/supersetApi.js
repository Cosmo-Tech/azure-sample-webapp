// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const { getConfigValue } = require('../common/config');
const { ServiceAccountError } = require('../common/errors');

const checkSupersetResponse = async (res, hintsByStatusCode = {}) => {
  if (res.ok) return;

  let errorMessage;
  try {
    const responseData = await res.json();
    errorMessage = responseData.message;
  } catch (err) {
    // No error message found, ignore the error
  }

  throw new ServiceAccountError(
    res.status,
    res.statusText,
    hintsByStatusCode?.[res.status] ?? errorMessage ?? 'Unknown error',
    `Error while retrieving report embed details\r\n${errorMessage ?? res.statusText}`
  );
};

const getSupersetAdminToken = async () => {
  const apiURL = getConfigValue('SUPERSET_API_URL').replace(/\/+$/, ''); // Remove trailing slashes from URL
  const queryURL = `${apiURL}/security/login`;

  const adminUsername = getConfigValue('SUPERSET_SUPERUSER_USERNAME');
  const adminPassword = getConfigValue('SUPERSET_SUPERUSER_PASSWORD');
  const body = JSON.stringify({ username: adminUsername, password: adminPassword, provider: 'db' });
  const headers = { 'Content-Type': 'application/json' };

  console.debug(`DEBUG: fetching superset admin token from "${queryURL}"...`);
  const res = await fetch(queryURL, { method: 'POST', headers, body });
  console.debug('DEBUG: response received');

  const hintsByStatusCode = { 401: `Not authorized: wrong credentials for superset admin service account` };
  await checkSupersetResponse(res, hintsByStatusCode);

  const data = await res.json();
  return data.access_token;
};

const getSupersetGuestToken = async (adminToken, dashboardIds) => {
  const apiURL = getConfigValue('SUPERSET_API_URL').replace(/\/+$/, ''); // Remove trailing slashes from URL
  const queryURL = `${apiURL}/security/guest_token`;

  const resources = dashboardIds.map((dashboardId) => ({ type: 'dashboard', id: dashboardId }));
  const user = { username: 'Guest', first_name: 'Guest', last_name: 'Guest' };
  const rls = [];

  const body = JSON.stringify({ resources, rls, user });
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` };

  console.debug(`DEBUG: fetching superset guest token from "${queryURL}"...`);
  const res = await fetch(queryURL, { method: 'POST', headers, body });
  console.debug('DEBUG: response received');

  const hintsByStatusCode = { 400: `Couldn't retrieve guest token for superset dashboards` };
  await checkSupersetResponse(res, hintsByStatusCode);

  const data = await res.json();
  return data.token;
};

module.exports = {
  getSupersetAdminToken,
  getSupersetGuestToken,
};
