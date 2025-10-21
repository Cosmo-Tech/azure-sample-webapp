// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const { getConfigValue } = require('../common/config');
const { ServiceAccountError } = require('../common/errors');

const getWorkspace = async (authorizationHeader, organizationId, workspaceId) => {
  const apiURL = getConfigValue('COSMOTECH_API_URL').replace(/\/+$/, ''); // Remove trailing slashes from URL
  const getWorkspaceURL = `${apiURL}/organizations/${organizationId}/workspaces/${workspaceId}`;
  const headers = { 'Content-Type': 'application/json', Authorization: authorizationHeader };

  console.debug(`DEBUG: fetching Cosmo workspace data from "${getWorkspaceURL}"...`);
  let res;
  try {
    res = await fetch(getWorkspaceURL, { method: 'GET', headers });
  } catch (err) {
    const isNetworkError = err.message === 'fetch failed';
    const statusText = isNetworkError ? 'Network error' : (err.name ?? 'Unknown Error');
    const errorMessage = isNetworkError ? "Can't reach Cosmo Tech API" : err.message;

    throw new ServiceAccountError('', statusText, errorMessage, `Error while retrieving report embed details`);
  }
  console.debug('DEBUG: workspace data received');

  if (!res.ok) {
    const hintsByStatusCode = {
      403: `Forbidden: "${getWorkspaceURL}"`,
      404: `Not Found: "${getWorkspaceURL}"`,
    };

    throw new ServiceAccountError(
      res.status,
      res.statusText,
      hintsByStatusCode?.[res.status] ?? 'Unknown error',
      `Error while retrieving report embed details\r\n${res.statusText}`
    );
  }

  return res.json();
};

module.exports = {
  getWorkspace,
};
