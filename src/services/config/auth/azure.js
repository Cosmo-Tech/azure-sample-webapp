// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { AuthMSAL } from '@cosmotech/azure';
import { Auth } from '@cosmotech/core';
import ConfigService from '../../ConfigService';

const APP_REGISTRATION_CLIENT_ID = ConfigService.getParameterValue('APP_REGISTRATION_CLIENT_ID');
const AZURE_TENANT_ID = ConfigService.getParameterValue('AZURE_TENANT_ID');

export const SHOW_AZURE_AUTH_PROVIDER = APP_REGISTRATION_CLIENT_ID != null && APP_REGISTRATION_CLIENT_ID !== '';
const COSMOTECH_API_SCOPE = ConfigService.getParameterValue('COSMOTECH_API_SCOPE');

const publicUrl = ConfigService.getParameterValue('PUBLIC_URL') ?? '';
const MSAL_AZURE_CONFIG = {
  loginRequest: { scopes: ['user.read'] },
  accessRequest: { scopes: [COSMOTECH_API_SCOPE] },
  msalConfig: {
    auth: {
      clientId: APP_REGISTRATION_CLIENT_ID,
      redirectUri: `${window.location.protocol}//${window.location.host}${publicUrl}/sign-in`,
      authority: `https://login.microsoftonline.com/${AZURE_TENANT_ID}`,
      knownAuthorities: [`https://login.microsoftonline.com/${AZURE_TENANT_ID}`],
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: false,
    },
  },
};

if (SHOW_AZURE_AUTH_PROVIDER) {
  Auth.addProvider(AuthMSAL).setConfig(MSAL_AZURE_CONFIG);
}
