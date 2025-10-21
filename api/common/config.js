// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const uuid = require('uuid');
const { ServiceAccountError } = require('./errors');

// Sanitize the provided value to always provided a non-empty string or undefined
const sanitizeValue = (value) => {
  if (typeof value !== 'string') return undefined;

  const strValue = value?.trim() ?? '';
  return strValue.length !== 0 ? strValue : undefined;
};

const ALL_PARAMETERS = [
  // Superset-specific parameters
  'COSMOTECH_API_URL',
  'SUPERSET_API_URL',
  'SUPERSET_SUPERUSER_USERNAME',
  'SUPERSET_SUPERUSER_PASSWORD',

  // PowerBI-specific parameters
  'POWER_BI_CLIENT_ID',
  'POWER_BI_CLIENT_SECRET',
  'POWER_BI_TENANT_ID',
  'AZURE_COSMO_API_APPLICATION_ID', // Only required for "PowerBI + Azure" user tokens
  'KEYCLOAK_REALM_URL', // Only required for "PowerBI + Keycloak" user tokens
  'ROLES_JWT_CLAIM',
  'CERT_PUBKEY_PEM_PATH',
  'CERT_ALGORITHMS',
  'UNSAFE_DISABLE_TOKEN_VERIFICATION',
  'NODE_TLS_REJECT_UNAUTHORIZED',
];

const envVars = Object.assign(
  {},
  ...ALL_PARAMETERS.map((parameterName) => ({ [parameterName]: sanitizeValue(process.env[parameterName]) }))
);
const getConfigValue = (parameterName) => envVars[parameterName];

const throwConfigError = (message) => {
  throw new ServiceAccountError(500, 'Configuration error', message);
};

const checkPowerBIConfig = () => {
  const REQUIRED_PARAMETERS = ['POWER_BI_CLIENT_ID', 'POWER_BI_CLIENT_SECRET', 'POWER_BI_TENANT_ID'];
  const GUID_PARAMETERS = ['POWER_BI_CLIENT_ID', 'POWER_BI_TENANT_ID'];

  for (const parameter of REQUIRED_PARAMETERS) {
    if (!getConfigValue(parameter))
      throwConfigError(
        `Missing parameter "${parameter}" in PowerBI service account configuration: value is missing or empty.`
      );
  }

  for (const parameter of GUID_PARAMETERS) {
    const sanitizedValue = getConfigValue(parameter);
    if (sanitizedValue && !uuid.validate(sanitizedValue))
      throwConfigError(`The value of parameter "${parameter}" must be a guid.`);
  }

  const azureCsmApiAppId = getConfigValue('AZURE_COSMO_API_APPLICATION_ID');
  const keycloakRealm = getConfigValue('KEYCLOAK_REALM_URL');
  if (azureCsmApiAppId && keycloakRealm)
    throwConfigError(
      "Can't define both parameters AZURE_COSMO_API_APPLICATION_ID and KEYCLOAK_REALM_URL. Please check the " +
        'PowerBI service account configuration.'
    );
  if (!azureCsmApiAppId && !keycloakRealm)
    throwConfigError(
      'You must define one of parameters AZURE_COSMO_API_APPLICATION_ID or KEYCLOAK_REALM_URL. Please check ' +
        'the PowerBI service account configuration.'
    );
};

const checkSupersetConfig = () => {
  const REQUIRED_PARAMETERS = [
    'COSMOTECH_API_URL',
    'SUPERSET_API_URL',
    'SUPERSET_SUPERUSER_USERNAME',
    'SUPERSET_SUPERUSER_PASSWORD',
  ];

  for (const parameter of REQUIRED_PARAMETERS) {
    if (!getConfigValue(parameter))
      throwConfigError(
        `Missing parameter "${parameter}" in Superset service account configuration: value is missing or empty.`
      );
  }
};

module.exports = {
  ALL_PARAMETERS,
  checkPowerBIConfig,
  checkSupersetConfig,
  getConfigValue,
};
