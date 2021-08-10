// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { Auth, AuthDev } from '@cosmotech/core';
import { AuthMSAL } from '@cosmotech/azure';
import { AZURE_TENANT_ID, APP_REGISTRATION_CLIENT_ID, DEFAULT_BASE_PATH } from '../../config/AppInstance.js';

// Expected input base path format: https://dev.api.cosmotech.com or https://dev.api.cosmotech.com/
// Generated output: 'http://dev.api.cosmotech.com/platform'
function forgeScopeFromBasePath (basePath) {
  const domainNameRegexp = /^https:\/\/(.*)(\/)?$/;
  const domainName = basePath.replace(/\/$/, '').match(domainNameRegexp);
  if (!domainName) {
    throw new Error('DEFAULT_BASE_PATH does not match the expected format (e.g. https://dev.api.cosmotech.com)');
  }
  return `http://${domainName[1]}/platform`;
}

// AuthMSAL configuration
const MSAL_CONFIG = {
  loginRequest: {
    scopes: ['user.read']
  },
  accessRequest: {
    scopes: [forgeScopeFromBasePath(DEFAULT_BASE_PATH)]
  },
  msalConfig: {
    auth: {
      clientId: APP_REGISTRATION_CLIENT_ID,
      redirectUri: window.location.protocol + '//' + window.location.host + '/scenario',
      authority: `https://login.microsoftonline.com/${AZURE_TENANT_ID}`,
      knownAuthorities: [`https://login.microsoftonline.com/${AZURE_TENANT_ID}`]
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: true
    }
  }
};

// Register the providers used in the application
Auth.addProvider(AuthDev);
Auth.addProvider(AuthMSAL).setConfig(MSAL_CONFIG);
