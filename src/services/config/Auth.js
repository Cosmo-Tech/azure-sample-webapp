// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import * as msal from '@azure/msal-browser';
import { AuthMSAL } from '@cosmotech/azure';
import { Auth, AuthDev, AuthKeycloakExperimental } from '@cosmotech/core';
import ConfigService from '../../services/ConfigService';

export const POWER_BI_API_DEFAULT_SCOPE = 'https://analysis.windows.net/powerbi/api/.default';

const APP_REGISTRATION_CLIENT_ID = ConfigService.getParameterValue('APP_REGISTRATION_CLIENT_ID');
const AZURE_TENANT_ID = ConfigService.getParameterValue('AZURE_TENANT_ID');
export const COSMOTECH_API_SCOPE = ConfigService.getParameterValue('COSMOTECH_API_SCOPE');

// AuthMSAL configuration (Login with Azure/Microsoft)
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
      redirectUri: `${window.location.protocol}//${window.location.host}${process.env?.PUBLIC_URL ?? ''}/sign-in`,
      authority: `https://login.microsoftonline.com/${AZURE_TENANT_ID}`,
      knownAuthorities: [`https://login.microsoftonline.com/${AZURE_TENANT_ID}`],
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: false,
    },
  },
};

const keycloakRedirectUrl =
  `${window.location.protocol}//${window.location.host}${process.env?.PUBLIC_URL ?? ''}` + '/sign-in';
console.log(keycloakRedirectUrl);
// AuthKeycloak configuration
const MSAL_KEYCLOAK_CONFIG = {
  loginRequest: {
    // scopes: ['user.read'],
    // scopes: ['roles', 'openid', 'email', 'profile'],
    prompt: 'login',
  },
  accessRequest: {
    // scopes: [COSMOTECH_API_SCOPE],
    // scopes: ['roles', 'openid', 'email', 'profile'],
    prompt: 'login',
  },
  msalConfig: {
    auth: {
      protocolMode: msal.ProtocolMode.OIDC,
      authorityMetadata: JSON.stringify({
        authorization_endpoint: 'https://kubernetes.cosmotech.com/keycloak/realms/brewery/protocol/openid-connect/auth',
        token_endpoint: 'https://kubernetes.cosmotech.com/keycloak/realms/brewery/protocol/openid-connect/token',
        issuer: 'https://kubernetes.cosmotech.com/keycloak/realms/brewery',
        userinfo_endpoint: 'https://kubernetes.cosmotech.com/keycloak/realms/brewery/protocol/openid-connect/userinfo',
      }),
      clientId: APP_REGISTRATION_CLIENT_ID,
      redirectUri: keycloakRedirectUrl,
      authority: 'https://kubernetes.cosmotech.com/keycloak/realms/brewery',
      knownAuthorities: ['https://kubernetes.cosmotech.com/keycloak/realms/brewery'],
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: false,
    },
  },
};

// Optional config for local fake dev account (can't be used to retrieve a valid token)
const AUTH_DEV_CONFIG = {
  // accountId: 'xxxxxxxx-xxxx-dave-xxxx-xxxxxxxxxxxx',
  // userEmail: 'dev.sample.webapp@example.com',
  // userId: 'xxxxxxxx-xxxx-dave-xxxx-xxxxxxxxxxxx',
  // userName: 'Dave Lauper',
  // roles: ['Organization.User'],
};

if (process.env.REACT_APP_AUTH_DEV_ACCOUNT_ID) AUTH_DEV_CONFIG.accountId = process.env.REACT_APP_AUTH_DEV_ACCOUNT_ID;
if (process.env.REACT_APP_AUTH_DEV_USER_EMAIL) AUTH_DEV_CONFIG.userEmail = process.env.REACT_APP_AUTH_DEV_USER_EMAIL;
if (process.env.REACT_APP_AUTH_DEV_USER_ID) AUTH_DEV_CONFIG.userId = process.env.REACT_APP_AUTH_DEV_USER_ID;
if (process.env.REACT_APP_AUTH_DEV_USER_NAME) AUTH_DEV_CONFIG.userName = process.env.REACT_APP_AUTH_DEV_USER_NAME;
if (process.env.REACT_APP_AUTH_DEV_ROLE) AUTH_DEV_CONFIG.roles = [process.env.REACT_APP_AUTH_DEV_ROLE];

// Register the providers used in the application
Auth.addProvider(AuthKeycloakExperimental).setConfig(MSAL_KEYCLOAK_CONFIG);
Auth.addProvider(AuthDev).setConfig(AUTH_DEV_CONFIG);
Auth.addProvider(AuthMSAL).setConfig(MSAL_CONFIG);
