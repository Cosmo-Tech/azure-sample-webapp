# Global configuration of the webapp

The [src/config/GlobalConfiguration.js](../src/config/GlobalConfiguration.js) file defines constants specific to your application
instance: you will need to fill these values when creating a new staging or prod version of your application.

- **AZURE_TENANT_ID** is the identifier of the Azure tenant your application is registered in.\
  You can find it in _Azure portal > App registration > Overview_.
- **APP_REGISTRATION_CLIENT_ID** is the identifier of your app registration.\
  You can find it in _Azure portal > App registration > Overview_.
- **COSMOTECH_API_SCOPE** is the Cosmo Tech API Platform scope (e.g. http://dev.api.cosmotech.com/platform).
  If you don't know which one you should use, please contact your Cosmo Tech administrator.
- **DEFAULT_BASE_PATH** is the URL to the Cosmo Tech API you want to use (e.g. https://dev.api.cosmotech.com).\
  If you don't know which one you should use, please contact your Cosmo Tech administrator.
- **ORGANIZATION_ID** is the identifier of your organization in the Cosmo Tech portal.\
  If you don't know its value, please contact your Cosmo Tech administrator.
- **WORKSPACE_ID** is the identifier of the workspace you created with the Cosmo Tech API.\
  If you don't know its value, please contact your Cosmo Tech administrator.