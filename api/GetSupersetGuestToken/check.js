// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const { isString, isValidCosmoResourceId } = require('../common/check');
const { ServiceAccountError } = require('../common/errors');
const { getWorkspace } = require('./cosmoApi');

const throwBadRequestError = (message) => {
  throw new ServiceAccountError(400, 'Bad request', message);
};

const validateAndGetQueryParameters = (req) => {
  const organizationId = req?.body?.organizationId;
  if (!isString(organizationId)) throwBadRequestError('Query is invalid. Parameter "organizationId" must be a string.');
  if (!isValidCosmoResourceId(organizationId))
    throwBadRequestError('Query is invalid. Parameter "organizationId" is not a valid organization id.');

  const workspaceId = req?.body?.workspaceId;
  if (!isString(workspaceId)) throwBadRequestError('Query is invalid. Parameter "workspaceId" must be a string.');
  if (!isValidCosmoResourceId(workspaceId))
    throwBadRequestError('Query is invalid. Parameter "workspaceId" is not a valid workspace id.');

  const dashboardIds = req?.body?.dashboardIds;
  if (!Array.isArray(dashboardIds))
    throwBadRequestError('Query is invalid. Parameter "dashboardIds" must be an array.');
  if (dashboardIds.length === 0)
    throwBadRequestError('List of dashboards is empty. Please check your dashboard configuration.');

  for (const dashboardId of dashboardIds) {
    if (!isString(dashboardId))
      throwBadRequestError(
        `Superset dashboard id "${dashboardId}" is not valid. Please check your dashboard configuration.`
      );
  }

  const authorizationHeader = req?.headers?.['csm-authorization'];
  if (!isString(authorizationHeader)) throwBadRequestError('Missing or invalid request header "csm-authorization".');

  return { organizationId, workspaceId, dashboardIds, authorizationHeader };
};

const checkDashboardsAreInWorkspace = (workspace, requestedDashboardIds) => {
  const chartsDashboards = workspace?.webApp?.options?.charts?.dashboards ?? [];
  const workspaceDashboardIds = chartsDashboards.map((dashboard) => dashboard.id);
  const unauthorizedDashboardIds = requestedDashboardIds.filter(
    (requestedDashboardId) => !workspaceDashboardIds.includes(requestedDashboardId)
  );

  if (unauthorizedDashboardIds.length !== 0) {
    const unauthorizedDashboards = '"' + unauthorizedDashboardIds.join('", "') + '"';
    throw new ServiceAccountError(
      403,
      'Forbidden',
      `Requested dashboard ids are not used in workspace "${workspace?.id}": ${unauthorizedDashboards}`
    );
  }
};

const validateQuery = async (req) => {
  const { organizationId, workspaceId, dashboardIds, authorizationHeader } = validateAndGetQueryParameters(req);
  const workspace = await getWorkspace(authorizationHeader, organizationId, workspaceId);
  checkDashboardsAreInWorkspace(workspace, dashboardIds);
  return dashboardIds;
};

module.exports = {
  validateQuery,
};
