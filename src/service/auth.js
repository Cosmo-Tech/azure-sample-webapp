import { Auth, AuthDev } from '@cosmotech/core'
import { AuthMSAL, AuthStaticWebApp } from '@cosmotech/azure'

// AuthMSAL configuration
const msalConfig = {
  loginRequest: {
    scopes: ['user.read']
  },
  msalConfig: {
    auth: {
      clientId: 'dbc3efdc-2aa4-4683-a24f-20c7b1614bbc',
      redirectUri: window.location.protocol + '//' + window.location.host + '/digitaltwin',
      authority: 'https://login.microsoftonline.com/e9641c78-d0d6-4d09-af63-168922724e7f/',
      knownAuthorities: ['https://login.microsoftonline.com']
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
Auth.addProvider(AuthMSAL).setConfig(msalConfig)
