// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { Auth, AuthDev } from '@cosmotech/core'
import { AuthMSAL, AuthStaticWebApp } from '@cosmotech/azure'

// AuthMSAL configuration
const MSAL_CONFIG = {
  loginRequest: {
    scopes: ['user.read']
  },
  accessRequest: {
    scopes: ['https://cosmotechweb.onmicrosoft.com/cosmo_sample/cosmoplatform']
  },
  msalConfig: {
    auth: {
      clientId: '3ae79982-a3dd-471b-9a9e-268b4ff0d5a6',
      redirectUri: window.location.protocol + '//' + window.location.host + '/scenario',
      authority: 'https://login.microsoftonline.com/1fcfc752-2be8-42b2-be24-0f1bb2ef2164',
      knownAuthorities: ['https://login.microsoftonline.com/1fcfc752-2be8-42b2-be24-0f1bb2ef2164']
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: true
    }
  }
}

// Register the providers used in the application
Auth.addProvider(AuthDev)
Auth.addProvider(AuthStaticWebApp)
Auth.addProvider(AuthMSAL).setConfig(MSAL_CONFIG)
