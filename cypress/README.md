# Cypress tests

## Service account authentication with MSAL

MSAL authentication with a service account can be used to bypass the login page when running tests. This feature
requires an **app registration with delegated permissions on the API app registration**. To enable and configure this
feature, you have to set the following environment variables:

- `CYPRESS_AUTHENTICATE_WITH_SERVICE_ACCOUNT`: set to `1` to enable the service account authentication
- `CY_MSAL_TENANT_ID`: tenant id of the app registration with delegated permissions
- `CY_MSAL_CLIENT_ID`: client id of the app registration with delegated permissions
- `CY_MSAL_CLIENT_SECRET`: a valid secret of the app registration with delegated permissions
- `CY_MSAL_API_HOSTNAME_FOR_SCOPE`: the FQDN of the API used as scope to request a token from MSAL (e.g.
  "dev.api.cosmotech.com")

When launching cypress with a yarn command, you may have to set these environment variables in the same command instruction:

```
CYPRESS_AUTHENTICATE_WITH_SERVICE_ACCOUNT=1 \
  CY_MSAL_TENANT_ID="$CY_MSAL_TENANT_ID" \
  CY_MSAL_CLIENT_ID="$CY_MSAL_CLIENT_ID" \
  CY_MSAL_CLIENT_SECRET="$CY_MSAL_CLIENT_SECRET" \
  CY_MSAL_API_HOSTNAME_FOR_SCOPE="$CY_MSAL_API_HOSTNAME_FOR_SCOPE" \
  yarn cypress
```

To run cypress tests in headless mode, with the default electron browser, you can also run:

```
CYPRESS_AUTHENTICATE_WITH_SERVICE_ACCOUNT=1 \
  CY_MSAL_TENANT_ID="$CY_MSAL_TENANT_ID" \
  CY_MSAL_CLIENT_ID="$CY_MSAL_CLIENT_ID" \
  CY_MSAL_CLIENT_SECRET="$CY_MSAL_CLIENT_SECRET" \
  CY_MSAL_API_HOSTNAME_FOR_SCOPE="$CY_MSAL_API_HOSTNAME_FOR_SCOPE" \
  node_modules/.bin/cypress run \
  --reporter cypress-mochawesome-reporter \
  --browser electron
```
