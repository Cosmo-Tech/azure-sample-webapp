// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const fs = require('fs');
const guid = require('guid');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const { MSAL_CONFIG, GUID_PARAMETERS, REQUIRED_PARAMETERS, getConfigValue } = require('./config');
const { ServiceAccountError } = require('./errors');

const DEFAULT_AZURE_JWKS_URI = 'https://login.microsoftonline.com/common/discovery/keys';
const DEFAULT_KEYCLOAK_AUDIENCE = 'account';

const sanitizeAndValidateConfig = () => {
  for (const parameter of REQUIRED_PARAMETERS) {
    if (!getConfigValue(parameter) || getConfigValue(parameter).length === 0)
      throw new ServiceAccountError(
        500,
        'Configuration error',
        `Missing parameter "${parameter}" in PowerBI service account configuration: value is missing or empty.`
      );
  }

  for (const parameter of GUID_PARAMETERS) {
    const sanitizedValue = getConfigValue(parameter);
    if (sanitizedValue && !guid.isGuid(sanitizedValue))
      throw new ServiceAccountError(
        500,
        'Configuration error',
        `The value of parameter "${parameter}" must be a guid.`
      );
  }

  const azureCsmApiAppId = getConfigValue('AZURE_COSMO_API_APPLICATION_ID');
  const keycloakRealm = getConfigValue('KEYCLOAK_REALM_URL');
  if (azureCsmApiAppId && keycloakRealm)
    throw new ServiceAccountError(
      500,
      'Configuration error',
      "Can't define both parameters AZURE_COSMO_API_APPLICATION_ID and KEYCLOAK_REALM_URL. Please check the " +
        'PowerBI service account configuration.'
    );
  if (!azureCsmApiAppId && !keycloakRealm)
    throw new ServiceAccountError(
      500,
      'Configuration error',
      'You must define one of parameters AZURE_COSMO_API_APPLICATION_ID or KEYCLOAK_REALM_URL. Please check ' +
        'the PowerBI service account configuration.'
    );
};

const _validateAndDecodeQueryToken = async (req) => {
  const accessToken = req?.headers?.['csm-authorization']?.replace('Bearer ', '');
  if (!accessToken) {
    throw new ServiceAccountError(401, 'Unauthorized', 'Token is missing in query.');
  }

  const getSigningKey = async (header) => {
    try {
      const keycloakRealm = getConfigValue('KEYCLOAK_REALM_URL');
      const jwksUri = keycloakRealm ? `${keycloakRealm}/protocol/openid-connect/certs` : DEFAULT_AZURE_JWKS_URI;
      const client = jwksClient({ jwksUri });
      const key = await client.getSigningKey(header.kid);
      return key.publicKey ?? key.rsaPublicKey;
    } catch (error) {
      if (error instanceof jwksClient.SigningKeyNotFoundError) {
        console.error(error);
        throw new ServiceAccountError(
          500,
          'Internal server error',
          'Unable to find a signing key matching the provided token, please check the PowerBI service account ' +
            'configuration.'
        );
      }
      throw error;
    }
  };

  const options = {
    audience: getConfigValue('AZURE_COSMO_API_APPLICATION_ID') ?? DEFAULT_KEYCLOAK_AUDIENCE,
    iss: `${MSAL_CONFIG.auth.authority}`,
  };

  const certificate_pem_file_path = getConfigValue('CERT_PUBKEY_PEM_PATH');
  let token;
  if (certificate_pem_file_path != null && certificate_pem_file_path !== '') {
    console.debug('Using custom cert file for token verification...');
    const cert = fs.readFileSync(certificate_pem_file_path);
    token = await jwt.verify(accessToken, cert, options);
  } else {
    console.debug('Using jwks endpoint for token verification...');
    const tokenHeader = jwt.decode(accessToken, { complete: true }).header;
    const publicKey = await getSigningKey(tokenHeader);
    token = await jwt.verify(accessToken, publicKey, options);
  }

  if (!token) throw new ServiceAccountError(401, 'Unauthorized', "Can't decode token");

  const rolesClaim = getConfigValue('ROLES_JWT_CLAIM');
  const roles = token[rolesClaim] ?? token.roles ?? token.userRoles ?? token.customRoles;
  if (!roles || roles.length === 0)
    throw new ServiceAccountError(401, 'Unauthorized', 'Missing roles for Cosmo Tech API');

  return token;
};

const validateTokenAndQuery = async (req) => {
  // Check token sent by user
  try {
    await _validateAndDecodeQueryToken(req);
  } catch (error) {
    if (error instanceof ServiceAccountError) {
      throw error;
    }
    const errorMessage = `${error.name}: ${error.message}`;
    throw new ServiceAccountError(401, 'Unauthorized', errorMessage);
  }

  // Check reports parameter
  const reportsIds = req?.body?.reports;
  if (!Array.isArray(reportsIds))
    throw new ServiceAccountError(400, 'Bad request', 'Query is invalid. Parameter "reports" must be an array.');
  if (reportsIds.length === 0)
    throw new ServiceAccountError(
      400,
      'Bad request',
      'List of reports is empty. Please check your dashboards configuration.'
    );

  for (const reportId of reportsIds) {
    if (!guid.isGuid(reportId))
      throw new ServiceAccountError(
        400,
        'Bad request',
        `PowerBI report id "${reportId}" is not a valid id. Please check your dashboards configuration.`
      );
  }

  // Check PowerBI workspace id parameter
  const workspaceId = req?.body?.workspaceId;
  if (workspaceId != null && !guid.isGuid(workspaceId))
    throw new ServiceAccountError(
      400,
      'Bad request',
      `PowerBI workspace id "${workspaceId}" is not a valid id. Please check your dashboards configuration.`
    );
};

module.exports = {
  getConfigValue,
  sanitizeAndValidateConfig,
  validateTokenAndQuery,
};
