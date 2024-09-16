// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { ProtocolMode } from '@azure/msal-browser';
import { Auth, AuthKeycloakRedirect } from '@cosmotech/core';
import ConfigService from '../../ConfigService';

const AUTH_KEYCLOAK_CLIENT_ID = ConfigService.getParameterValue('AUTH_KEYCLOAK_CLIENT_ID');
const AUTH_KEYCLOAK_REALM = ConfigService.getParameterValue('AUTH_KEYCLOAK_REALM');
const AUTH_KEYCLOAK_ROLES_JWT_CLAIM = ConfigService.getParameterValue('AUTH_KEYCLOAK_ROLES_JWT_CLAIM');

let authorityDomain;
try {
  if (AUTH_KEYCLOAK_REALM) authorityDomain = new URL(AUTH_KEYCLOAK_REALM)?.hostname;
} catch (e) {
  console.error(`Failed to parse authority domain name from keycloak realm: "${AUTH_KEYCLOAK_REALM}"`);
}

export const SHOW_KEYCLOAK_AUTH_PROVIDER = AUTH_KEYCLOAK_CLIENT_ID && AUTH_KEYCLOAK_CLIENT_ID !== '' && authorityDomain;

const redirectUrl = `${window.location.protocol}//${window.location.host}${process.env?.PUBLIC_URL ?? ''}` + '/sign-in';
const MSAL_KEYCLOAK_CONFIG = {
  rolesJwtClaim: AUTH_KEYCLOAK_ROLES_JWT_CLAIM,
  loginRequest: {},
  accessRequest: {},
  msalConfig: {
    auth: {
      protocolMode: ProtocolMode.OIDC,
      authorityMetadata: JSON.stringify({
        authorization_endpoint: `${AUTH_KEYCLOAK_REALM}/protocol/openid-connect/auth`,
        token_endpoint: `${AUTH_KEYCLOAK_REALM}/protocol/openid-connect/token`,
        issuer: AUTH_KEYCLOAK_REALM,
        userinfo_endpoint: `${AUTH_KEYCLOAK_REALM}/protocol/openid-connect/userinfo`,
        end_session_endpoint: `${AUTH_KEYCLOAK_REALM}/protocol/openid-connect/logout`,
      }),
      clientId: AUTH_KEYCLOAK_CLIENT_ID,
      redirectUri: redirectUrl,
      postLogoutRedirectUri: redirectUrl,
      authority: `${AUTH_KEYCLOAK_REALM}`,
      knownAuthorities: [authorityDomain],
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: false,
    },
  },
};

Auth.addProvider(AuthKeycloakRedirect).setConfig(MSAL_KEYCLOAK_CONFIG);
