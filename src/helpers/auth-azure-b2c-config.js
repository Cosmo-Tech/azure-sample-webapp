export const b2cPolicies = {
  names: {
    signUpSignIn: 'B2C_1_SignUp_SignIn',
    forgotPassword: 'B2C_1_ResetPassword',
    editProfile: 'B2C_1_EditProfile'
  },
  authorities: {
    signUpSignIn: {
      authority: 'https://cosmotechweb.b2clogin.com/cosmotechweb.onmicrosoft.com/B2C_1_SignUp_SignIn'
    },
    forgotPassword: {
      authority: 'https://cosmotechweb.b2clogin.com/cosmotechweb.onmicrosoft.com/B2C_1_ResetPassword'
    },
    editProfile: {
      authority: 'https://cosmotechweb.b2clogin.com/cosmotechweb.onmicrosoft.com/B2C_1_EditProfile'
    }
  },
  authorityDomain: 'cosmotechweb.b2clogin.com'
}

export const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_AZURE_APPLICATION_CLIENT_ID,
    redirectUri: window.location.protocol + '//' + window.location.host + '/digitaltwin',
    authority: 'https://login.microsoftonline.com/1fcfc752-2be8-42b2-be24-0f1bb2ef2164/',
    knownAuthorities: ['https://login.microsoftonline.com']
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true
  }
}

export const loginRequest = {
  scopes: ['user.read']
  // scopes: [...apiConfig.b2cScopes],
}
