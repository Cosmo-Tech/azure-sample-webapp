// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const guid = require('guid');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const msalConfig = require('./config');

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

const _validateAndDecodeQueryToken = async (req) => {
  const client = jwksClient({ jwksUri: 'https://login.microsoftonline.com/common/discovery/keys' });
  const options = {
    // audience check is optional but strongly advised, it won't be checked if CSM_API_TOKEN_AUDIENCE is not defined
    audience: process.env.CSM_API_TOKEN_AUDIENCE,
    iss: `${msalConfig.auth.authority}`,
  };

  const _getSigningKey = (header, callback) => {
    client.getSigningKey(header.kid, (error, key) => {
      if (error) {
        console.error(error);
        throw error;
      }
      const signingKey = key.publicKey || key.rsaPublicKey;
      callback(null, signingKey);
    });
  };

  const accessToken = req?.headers?.authorization?.replace('Bearer ', '');
  if (!accessToken) {
    throw new Error('token is missing in query.');
  }

  return new Promise((resolve, reject) =>
    jwt.verify(accessToken, _getSigningKey, options, (err, decoded) => {
      return err ? reject(err) : resolve(decoded);
    })
  );
};

const validateQuery = async (req) => {
  try {
    const token = await _validateAndDecodeQueryToken(req);
    if (!token) return "Unauthorized: can't decode token";
    if (!token.roles || token.roles.length === 0) return 'Unauthorized: missing roles for Cosmo Tech API';
  } catch (error) {
    console.error('Token validation error: ' + error);
    return 'Unauthorized: ' + error;
  }

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
