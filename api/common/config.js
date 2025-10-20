// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// Sanitize the provided value to always provided a non-empty string or undefined
const sanitizeValue = (value) => {
  if (typeof value !== 'string') return undefined;

  const strValue = value?.trim() ?? '';
  return strValue.length !== 0 ? strValue : undefined;
};

const REQUIRED_PARAMETERS = ['POWER_BI_CLIENT_ID', 'POWER_BI_CLIENT_SECRET', 'POWER_BI_TENANT_ID'];
const OPTIONAL_PARAMETERS = [
  'AZURE_COSMO_API_APPLICATION_ID', // Only required for Azure user tokens
  'KEYCLOAK_REALM_URL', // Only required for Keycloak user tokens
  'ROLES_JWT_CLAIM',
  'CERT_PUBKEY_PEM_PATH',
  'CERT_ALGORITHMS',
  'UNSAFE_DISABLE_TOKEN_VERIFICATION',
  'NODE_TLS_REJECT_UNAUTHORIZED',
];
const ALL_PARAMETERS = [...REQUIRED_PARAMETERS, ...OPTIONAL_PARAMETERS];
const GUID_PARAMETERS = ['POWER_BI_CLIENT_ID', 'POWER_BI_TENANT_ID'];

const envVars = Object.assign(
  {},
  ...ALL_PARAMETERS.map((parameterName) => ({ [parameterName]: sanitizeValue(process.env[parameterName]) }))
);
const getConfigValue = (parameterName) => envVars[parameterName];

module.exports = {
  GUID_PARAMETERS,
  REQUIRED_PARAMETERS,
  OPTIONAL_PARAMETERS,
  ALL_PARAMETERS,
  getConfigValue,
};
