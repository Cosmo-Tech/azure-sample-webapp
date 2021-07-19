# Configure Azure sample webapp

This folder contains several configuration files for the WepApp.
Files are "domain" specific:
- Api.config.js for API configuration
- App.config.js for App configuration
- Auth.config.js for authentication configuration
- i18next.config.js for translation configuration


## Api configuration (Api.config.js)

The aim of this file is to allow the configuration of the Cosmo Tech API client.
You can set the API basePath for example.

## App configuration (App.config.js)

The aim of this file is to allow the configuration of the Web App.
In this file, you can find the Tab configuration, the application insight configuration, the languages list, the organization id (V1.X only), the workspace id (V1.X only), dashboards,...

### Application Insights
Steps to enable Application Insights in the webapp:
* in the Azure portal:
  * open the Static Web Apps instance
  * select Application Insights from the menu
  * select Yes next to Enable Application Insights
  * select Save.
* open the webapp configuration file *src/configs/App.config.js*
  * replace the instrumentationKey value with the instrumentation key of your application

### Dashboards configuration

About dashboards configuration (in Dashboards view or Scenario view respectively based on DASHBOARDS_LIST_CONFIG and SCENARIO_DASHBOARD_CONFIG constants) see the [detailed documentation](https://github.com/Cosmo-Tech/azure-sample-webapp/tree/main/src/views/Dashboards#readme)

## Auth configuration (Auth.config.js)

The aim of this file is to allow the configuration of the authentication based on [@cosmotech/core](https://www.npmjs.com/package/@cosmotech/core) and [@cosmotech/azure](https://www.npmjs.com/package/@cosmotech/azure)
Feel free to add your own auth provider if you don't want to use MSAL authentication.

## i18next configuration (i18next.config.js)
The aim of this file is to allow the react-i18next library configuration.
If you want further information, please check this [link](https://react.i18next.com/latest/using-with-hooks#configure-i-18-next)
