// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { Auth, AuthDev } from '@cosmotech/core';
import { AuthMSAL } from '@cosmotech/azure';
import { APP_REGISTRATION_CLIENT_ID, AZURE_TENANT_ID, COSMOTECH_API_SCOPE } from '../../config/AppInstance.js';

export const POWER_BI_API_DEFAULT_SCOPE = 'https://analysis.windows.net/powerbi/api/.default';

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
      redirectUri: window.location.protocol + '//' + window.location.host + '/scenario',
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
