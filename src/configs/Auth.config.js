// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { Auth, AuthDev } from '@cosmotech/core';
import { AuthMSAL } from '@cosmotech/azure';

// AuthMSAL configuration
const MSAL_CONFIG = {
  loginRequest: {
    scopes: ['user.read']
  },
  accessRequest: {
    scopes: ['http://dev.api.cosmotech.com/platform']
  },
  msalConfig: {
    auth: {
      clientId: 'd104fbd6-9464-45d5-a022-83c90ad56906',
      redirectUri: window.location.protocol + '//' + window.location.host + '/scenario',
      authority: 'https://login.microsoftonline.com/e413b834-8be8-4822-a370-be619545cb49',
      knownAuthorities: ['https://login.microsoftonline.com/e413b834-8be8-4822-a370-be619545cb49']
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
