import { Auth, AuthDev } from '@cosmotech/core'
import { AuthMSAL, AuthStaticWebApp } from '@cosmotech/azure'

// AuthMSAL configuration
const msalConfig = {
  loginRequest: {
    scopes: ['user.read']
  },
  accessRequest: {
    scopes: ['https://cosmotechweb.onmicrosoft.com/cosmo_sample/cosmoplatform']
  },
  msalConfig: {
    auth: {
      clientId: '3ae79982-a3dd-471b-9a9e-268b4ff0d5a6',
      redirectUri: window.location.protocol + '//' + window.location.host + '/digitaltwin',
      authority: 'https://login.microsoftonline.com/common/',
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
