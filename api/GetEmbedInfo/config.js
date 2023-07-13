// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// Sanitize the provided value to always provided a non-empty string or undefined
const sanitizeValue = (value) => {
  const strValue = value?.trim() ?? '';
  return strValue.length !== 0 ? strValue : undefined;
};

const REQUIRED_PARAMETERS = [
  'POWER_BI_SCOPE',
  'POWER_BI_CLIENT_ID',
  'POWER_BI_CLIENT_SECRET',
  'POWER_BI_TENANT_ID',
  'POWER_BI_AUTHORITY_URI',
];
const OPTIONAL_PARAMETERS = ['APPINSIGHTS_INSTRUMENTATIONKEY', 'CSM_API_TOKEN_AUDIENCE', 'POWER_BI_WORKSPACE_ID'];
const ALL_PARAMETERS = [...REQUIRED_PARAMETERS, ...OPTIONAL_PARAMETERS];

const GUID_PARAMETERS = ['POWER_BI_CLIENT_ID', 'POWER_BI_WORKSPACE_ID', 'POWER_BI_TENANT_ID'];

const envVars = Object.assign(
  {},
  ...ALL_PARAMETERS.map((parameterName) => ({ [parameterName]: sanitizeValue(process.env[parameterName]) }))
);
const getConfigValue = (parameterName) => envVars[parameterName];

const MSAL_CONFIG = {
  auth: {
    clientId: getConfigValue('POWER_BI_CLIENT_ID'),
    authority: `https://login.microsoftonline.com/${getConfigValue('POWER_BI_TENANT_ID')}`,
    clientSecret: getConfigValue('POWER_BI_CLIENT_SECRET'),
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: 3,
    },
  },
};

module.exports = {
  MSAL_CONFIG,
  GUID_PARAMETERS,
  REQUIRED_PARAMETERS,
  OPTIONAL_PARAMETERS,
  ALL_PARAMETERS,
  getConfigValue,
};
