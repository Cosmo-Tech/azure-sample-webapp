# Global configuration of the webapp

## Goal & context

The [src/config/GlobalConfiguration.json](../src/config/GlobalConfiguration.json) file defines constants that are
specific to your application instance: this means that you will need to adapt these values when deploying your web
application on a new environment.

The following parameters are available:

| parameter                                                       | required/optional                |
| --------------------------------------------------------------- | -------------------------------- |
| [APP_REGISTRATION_CLIENT_ID](#app_registration_client_id)       | required to log in with Azure    |
| [AUTH_KEYCLOAK_CLIENT_ID](#auth_keycloak_client_id)             | required to log in with Keycloak |
| [AUTH_KEYCLOAK_REALM](#auth_keycloak_realm)                     | required to log in with Keycloak |
| [AUTH_KEYCLOAK_ROLES_JWT_CLAIM](#auth_keycloak_roles_jwt_claim) | required to log in with Keycloak |
| [AZURE_TENANT_ID](#azure_tenant_id)                             | required to log in with Azure    |
| [COSMOTECH_API_SCOPE](#cosmotech_api_scope)                     | required to log in with Azure    |
| [DEFAULT_BASE_PATH](#default_base_path)                         | mandatory                        |
| [ORGANIZATION_ID](#organization_id)                             | mandatory                        |
| [PUBLIC_URL](#public_url)                                       | optional                         |
| [WORKSPACES_IDS_FILTER](#workspaces_ids_filter)                 | optional                         |

## Parameters description

### `APP_REGISTRATION_CLIENT_ID`

When using Azure as an authentication provider, you must set `APP_REGISTRATION_CLIENT_ID` to the identifier of the app
registration of your _Azure Static Web App_ instance.

You can find it in _Azure portal > App registrations > [App registration of your Static Web App] > Overview_.

Example: `12345678-ff90-810a-19c7-1234567890ab`

### `AUTH_KEYCLOAK_CLIENT_ID`

When using Keycloak as an authentication provider, you must set `AUTH_KEYCLOAK_CLIENT_ID` to the identifier of the
client (declared in Keycloak) that you want to use to authenticate users in the webapp.

You can find it in _Keycloak admin panel > Your realm > Clients_.

Example: `cosmotech-webapp-client`

### `AUTH_KEYCLOAK_REALM`

When using Keycloak as an authentication provider, you must set `AUTH_KEYCLOAK_REALM` to the URL of the Keycloak realm
you want to use.

Example: `https://mykeycloak.example.com/keycloak/realms/brewery`

### `AUTH_KEYCLOAK_ROLES_JWT_CLAIM`

When using Keycloak as an authentication provider, the value of `AUTH_KEYCLOAK_ROLES_JWT_CLAIM` describes the key in the
access token that contains the list of user roles. This value comes from the Cosmo Tech platform configuration, it is
defined by `csm.platform.authorization.roles-jwt-claim`.

Example: this value is usually `roles` or `userRoles`, but it can be customized when a new tenant is deployed.

### `AZURE_TENANT_ID`

When using Azure as an authentication provider, you must set `AZURE_TENANT_ID` to the identifier of the Azure tenant
your application is registered in.

You can find it in _Azure portal > App registrations > [App registration of your Static Web App] > Overview_.

Example: `12345678-ff90-810a-19c7-1234567890ab`

### `COSMOTECH_API_SCOPE`

When using Azure as an authentication provider, you must set `COSMOTECH_API_SCOPE` to the Cosmo Tech API Platform scope.
If you don't know how to find this value, please contact your Cosmo Tech administrator.

You can find it in _Azure portal > App registrations > [App registration of your API] > Expose an API_.

Example: `https://myapi.cosmotech.com/platform`

### `DEFAULT_BASE_PATH`

`DEFAULT_BASE_PATH` is the URL to the Cosmo Tech API you want to use. If you don't know which one you should use, please
contact your Cosmo Tech administrator.

Example: `https://myapi.cosmotech.com`

### `ORGANIZATION_ID`

`ORGANIZATION_ID` is the identifier of your organization resource, defined with the Cosmo Tech API. The web application
will only be able to browse workspaces inside this organization.

Example: `o-vlmxvdke5gqv4`

### `PUBLIC_URL`

`PUBLIC_URL` is an optional value describing the path from which the webapp is served. This option is especially useful
when you use a single host name to serve different resource (e.g. a web application and the server of the associated
API).

Example: `/webapp/brewery`

### `WORKSPACES_IDS_FILTER`

`WORKSPACES_IDS_FILTER` defines a filter to apply on workspaces displayed in the workspace selector, when opening
the webapp. This parameter must be an **array of workspace ids**, or it can be set to `null` to disable the filter.
When defined, users will only be able to see workspaces specified in the filter list for which they have the "_read_"
permission. If the filter is undefined, then the webapp will show all workspaces accessible by the current user.

Example: `["w-wrkspc01", "w-wrkspc02"]`
