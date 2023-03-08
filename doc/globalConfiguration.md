# Global configuration of the webapp

The [src/config/GlobalConfiguration.json](../src/config/GlobalConfiguration.json) file defines constants specific to your
application instance: you will need to fill these values when creating a new staging or prod version of your
application.

- **APP_REGISTRATION_CLIENT_ID** is the identifier of the app registration of your _Azure Static Web App_ instance.
  You can find it in _Azure portal > App registration > Overview_.
- **AZURE_TENANT_ID** is the identifier of the Azure tenant your application is registered in. You can find it in
  _Azure portal > App registration > Overview_.
- **COSMOTECH_API_SCOPE** is the Cosmo Tech API Platform scope (e.g. http://dev.api.cosmotech.com/platform). If you
  don't know which one you should use, please contact your Cosmo Tech administrator.
- **DEFAULT_BASE_PATH** is the URL to the Cosmo Tech API you want to use (e.g. https://dev.api.cosmotech.com). If you
  don't know which one you should use, please contact your Cosmo Tech administrator.
- **ORGANIZATION_ID** is the identifier of your organization in the Cosmo Tech portal. If you don't know its value,
  please contact your Cosmo Tech administrator.
- **WORKSPACES_IDS_FILTER** defines a filter to apply on workspaces displayed in the workspace selector, when opening
  the webapp. This parameter must be an array of workspace identifiers (e.g.
  `"WORKSPACES_IDS_FILTER": ["w-wrkspc01", "w-wrkspc02"]`), or it can be set to `null` to disable the filter
  (`"WORKSPACES_IDS_FILTER": null`). When defined , users will only be able to see workspaces specified in the filter
  list for which they have the "_read_" permission. If the filter is undefined , then the webapp will show all
  workspaces accessible by the current user.
