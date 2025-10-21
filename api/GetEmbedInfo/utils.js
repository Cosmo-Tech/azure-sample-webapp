// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const { getConfigValue } = require('../common/config');
const { MSAL_CONFIG } = require('./msalConfig');
const { ServiceAccountError } = require('../common/errors');

const DEFAULT_AZURE_JWKS_URI = 'https://login.microsoftonline.com/common/discovery/keys';
const DEFAULT_KEYCLOAK_AUDIENCE = 'account';

const _checkAccessTokenWithCertFile = (token, certFilePath, options) => {
  const cert = fs.readFileSync(certFilePath);
  return jwt.verify(token, cert, options);
};

const _checkAccessTokenWithCert = (accessToken, certPath, options) => {
  if (!fs.existsSync(certPath)) {
    throw new ServiceAccountError(
      500,
      'Configuration error',
      `Certificates not found: "${certPath}" does not exist. Please check the value of ` +
        'parameter CERT_PUBKEY_PEM_PATH in PowerBI service account configuration.'
    );
  }

  if (!fs.lstatSync(certPath).isDirectory()) {
    return _checkAccessTokenWithCertFile(accessToken, certPath, options);
  }

  console.log('CERT_PUBKEY_PEM_PATH value is a folder, looping through files...');
  const certFiles = fs.readdirSync(certPath);
  if (certFiles.length === 0) {
    throw new ServiceAccountError(
      500,
      'Configuration error',
      `Certificates not found: no files in "${certPath}". Please check the certificates folder and the value of ` +
        'parameter CERT_PUBKEY_PEM_PATH in PowerBI service account configuration.'
    );
  }

  for (const certFileName of certFiles) {
    const certFilePath = path.join(certPath, certFileName);
    if (fs.lstatSync(certFilePath).isDirectory()) {
      console.log(`[Skipped folder] ${certFileName}`);
      continue;
    }
    try {
      const decodedToken = _checkAccessTokenWithCertFile(accessToken, certFilePath, options);
      if (decodedToken != null) {
        console.log(`[Working certificate] ${certFileName}`);
        return decodedToken;
      }
    } catch (error) {
      console.log(`[Certificate error] ${certFileName}: ${error}`);
    }
  }
  throw new ServiceAccountError(
    401,
    'Unauthorized',
    'Token verification failed: could not find a matching certificate'
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

  const algorithmsString = getConfigValue('CERT_ALGORITHMS');
  if (algorithmsString != null && algorithmsString !== '') {
    try {
      const algorithms = algorithmsString.split(',');
      options.algorithms = algorithms;
      console.log(`Using custom list of algorithms for token validation: ${algorithms}`);
    } catch (error) {
      throw new ServiceAccountError(
        500,
        'Configuration error',
        `Can't parse list of algorithms: "${algorithmsString}". Please check the value of ` +
          'parameter CERT_ALGORITHMS in PowerBI service account configuration.'
      );
    }
  }

  const certPath = getConfigValue('CERT_PUBKEY_PEM_PATH');
  let token;
  if (certPath != null && certPath !== '') {
    console.debug('Using custom cert file for token verification...');
    token = _checkAccessTokenWithCert(accessToken, certPath, options);
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
  const disabled = getConfigValue('UNSAFE_DISABLE_TOKEN_VERIFICATION');
  if (disabled != null && disabled.toLowerCase() === 'true') {
    console.warn('WARNING: token validation disabled by option UNSAFE_DISABLE_TOKEN_VERIFICATION. Skipping...');
    return;
  }

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
    if (!uuid.validate(reportId))
      throw new ServiceAccountError(
        400,
        'Bad request',
        `PowerBI report id "${reportId}" is not a valid id. Please check your dashboards configuration.`
      );
  }

  // Check PowerBI workspace id parameter
  const workspaceId = req?.body?.workspaceId;
  if (workspaceId != null && !uuid.validate(workspaceId))
    throw new ServiceAccountError(
      400,
      'Bad request',
      `PowerBI workspace id "${workspaceId}" is not a valid id. Please check your dashboards configuration.`
    );
};

module.exports = {
  getConfigValue,
  validateTokenAndQuery,
};
