// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { AuthMSAL } from '@cosmotech/azure';
import { Auth, AuthDev } from '@cosmotech/core';
import ConfigService from '../../services/ConfigService';

export const POWER_BI_API_DEFAULT_SCOPE = 'https://analysis.windows.net/powerbi/api/.default';

const APP_REGISTRATION_CLIENT_ID = ConfigService.getParameterValue('APP_REGISTRATION_CLIENT_ID');
const AZURE_TENANT_ID = ConfigService.getParameterValue('AZURE_TENANT_ID');
export const COSMOTECH_API_SCOPE = ConfigService.getParameterValue('COSMOTECH_API_SCOPE');

// AuthMSAL configuration
const MSAL_CONFIG = {
  loginRequest: {
    scopes: ['user.read'],
  },
  accessRequest: {
    scopes: [COSMOTECH_API_SCOPE],
  },
  msalConfig: {
    auth: {
      clientId: APP_REGISTRATION_CLIENT_ID,
      redirectUri: window.location.protocol + '//' + window.location.host + '/sign-in',
      authority: `https://login.microsoftonline.com/${AZURE_TENANT_ID}`,
      knownAuthorities: [`https://login.microsoftonline.com/${AZURE_TENANT_ID}`],
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: true,
    },
  },
};

// Register the providers used in the application
Auth.addProvider(AuthDev);
Auth.addProvider(AuthMSAL).setConfig(MSAL_CONFIG);
