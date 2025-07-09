// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// c.f. README.md file in the cypress folder for a description of the env variables below
const CY_AUTH_KEYCLOAK_REALM = process.env.CY_AUTH_KEYCLOAK_REALM;
if (!CY_AUTH_KEYCLOAK_REALM)
  console.warn('Keycloak realm is empty! Please set CY_AUTH_KEYCLOAK_REALM env variable when running cypress');

const CY_AUTH_KEYCLOAK_CLIENT_ID = process.env.CY_AUTH_KEYCLOAK_CLIENT_ID;
if (!CY_AUTH_KEYCLOAK_CLIENT_ID)
  console.warn('Keycloak client id is empty! Please set CY_AUTH_KEYCLOAK_CLIENT_ID env variable when running cypress');

const CY_AUTH_KEYCLOAK_CLIENT_SECRET = process.env.CY_AUTH_KEYCLOAK_CLIENT_SECRET;
if (!CY_AUTH_KEYCLOAK_CLIENT_SECRET)
  console.warn(
    'Keycloak client secret is empty! Please set CY_AUTH_KEYCLOAK_CLIENT_SECRET env variable when running cypress'
  );

const scopes = ['openid', 'offline_access', 'email', 'profile'];
const msalSecretConfig = {
  loginRequest: { scopes },
  accessRequest: { scopes },
  auth: {
    protocolMode: 'OIDC',
    authorityMetadata: JSON.stringify({
      authorization_endpoint: `${CY_AUTH_KEYCLOAK_REALM}/protocol/openid-connect/auth`,
      token_endpoint: `${CY_AUTH_KEYCLOAK_REALM}/protocol/openid-connect/token`,
      issuer: CY_AUTH_KEYCLOAK_REALM,
      userinfo_endpoint: `${CY_AUTH_KEYCLOAK_REALM}/protocol/openid-connect/userinfo`,
      end_session_endpoint: `${CY_AUTH_KEYCLOAK_REALM}/protocol/openid-connect/logout`,
    }),
    clientId: CY_AUTH_KEYCLOAK_CLIENT_ID,
    authority: CY_AUTH_KEYCLOAK_REALM,
    knownAuthorities: [CY_AUTH_KEYCLOAK_REALM], // TODO: parse authority domain if token refresh fails
    clientSecret: CY_AUTH_KEYCLOAK_CLIENT_SECRET,
  },
};

const tokenRequest = { scopes };

module.exports = {
  SECRET_CONFIG: msalSecretConfig,
  TOKEN_REQUEST: tokenRequest,
};
