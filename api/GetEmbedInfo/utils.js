// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const guid = require('guid');

function getAuthHeader(accessToken) {
  // Function to append Bearer against the Access Token
  return 'Bearer '.concat(accessToken);
}

function validateConfig() {
  // Validation function to check whether the Configurations are available in the environment variables or not
  if (!process.env.POWER_BI_CLIENT_ID) {
    return (
      'ClientId is empty. Please register your application as Native app in https://dev.powerbi.com/apps and ' +
      'fill Client Id in the environment variables.'
    );
  }

  if (!guid.isGuid(process.env.POWER_BI_CLIENT_ID)) {
    return (
      'ClientId must be a Guid object. Please register your application as Native app in ' +
      'https://dev.powerbi.com/apps and fill Client Id in the environment variables.'
    );
  }

  if (!process.env.POWER_BI_WORKSPACE_ID) {
    return 'WorkspaceId is empty. Please select a group you own and fill its Id in the environment variables.';
  }

  if (!guid.isGuid(process.env.POWER_BI_WORKSPACE_ID)) {
    return (
      'WorkspaceId must be a Guid object. Please select a workspace you own and fill its Id in the environment ' +
      'variables.'
    );
  }

  if (!process.env.POWER_BI_CLIENT_SECRET || !process.env.POWER_BI_CLIENT_SECRET.trim()) {
    return 'ClientSecret is empty. Please fill Power BI ServicePrincipal ClientSecret in the environment variables.';
  }

  if (!process.env.POWER_BI_TENANT_ID) {
    return 'TenantId is empty. Please fill the TenantId in the environment variables.';
  }

  if (!guid.isGuid(process.env.POWER_BI_TENANT_ID)) {
    return (
      'TenantId must be a Guid object. Please select a workspace you own and fill its Id in the environment ' +
      'variables.'
    );
  }
}

const validateQuery = (req) => {
  const reportsIds = req?.body?.reports;
  if (!Array.isArray(reportsIds)) {
    return 'Query is invalid. Parameter "reports" must be an array.';
  }

  if (!reportsIds.length) {
    return 'List of reports is empty. Please check your dashboards configuration.';
  }

  for (const reportId of reportsIds) {
    if (!guid.isGuid(reportId)) {
      return `Report id "${reportId}" is not a valid id. Please check your dashboards configuration.`;
    }
  }
};

module.exports = {
  getAuthHeader,
  validateConfig,
  validateQuery,
};
