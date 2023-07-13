// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const guid = require('guid');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const { MSAL_CONFIG, GUID_PARAMETERS, REQUIRED_PARAMETERS, getConfigValue } = require('./config');
const { ServiceAccountError } = require('./errors');

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
};

const _validateAndDecodeQueryToken = async (req) => {
  const client = jwksClient({ jwksUri: 'https://login.microsoftonline.com/common/discovery/keys' });
  const options = {
    // audience check is optional but strongly advised, it won't be checked if CSM_API_TOKEN_AUDIENCE is not defined
    audience: getConfigValue('CSM_API_TOKEN_AUDIENCE'),
    iss: `${MSAL_CONFIG.auth.authority}`,
  };

  const _getSigningKey = (header, callback) => {
    client.getSigningKey(header.kid, (error, key) => {
      if (error) {
        throw error;
      }
      const signingKey = key.publicKey || key.rsaPublicKey;
      callback(null, signingKey);
    });
  };

  const accessToken = req?.headers?.['csm-authorization']?.replace('Bearer ', '');
  if (!accessToken) {
    throw new ServiceAccountError(401, 'Unauthorized', 'Token is missing in query.');
  }

  const token = await new Promise((resolve, reject) =>
    jwt.verify(accessToken, _getSigningKey, options, (err, decoded) => {
      return err ? reject(err) : resolve(decoded);
    })
  );

  if (!token) throw new ServiceAccountError(401, 'Unauthorized', "Can't decode token");
  if (!token.roles || token.roles.length === 0)
    throw new ServiceAccountError(401, 'Unauthorized', 'Missing roles for Cosmo Tech API');

  return token;
};

const validateQuery = async (req) => {
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
  validateQuery,
};
