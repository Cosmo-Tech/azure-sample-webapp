# Configure Azure sample webapp

This folder contains several configuration files for the WepApp.
Files are "domain" specific:
- Api.config.js for API configuration
- App.config.js for App configuration
- Auth.config.js for authentication configuration
- DashboardsList.config.js for Dashboard screen configuration
- ScenarioDashboard.config.js for dashboard on Scenario screen 
- i18next.config.js for translation configuration


## Api configuration (Api.config.js)

The aim of this file is to allow the configuration of the Cosmo Tech API client.
You can set the API basePath for example.

## App configuration (App.config.js)

The aim of this file is to allow the configuration of the Web App.
In this file, you can find the Tab configuration, the application insight configuration, the languages list, the organisation id (V1.X only) and the workspace id (V1.X only) 

## Auth configuration (Auth.config.js)

The aim of this file is to allow the configuration of the authentication based on [@cosmotech/core](https://www.npmjs.com/package/@cosmotech/core) and [@cosmotech/azure](https://www.npmjs.com/package/@cosmotech/azure)
Feel free to add your own auth provider if you don't want to use MSAL authentication.

## Dashboards screen configuration (DashboardsList.config.js)

The aim of this file is to allow the dashboard screen configuration.
See [Configure Dashboards View](https://github.com/Cosmo-Tech/azure-sample-webapp/edit/main/src/views/Dashboards/README.md) for more details.

## Scenario screen dashboard configuration (ScenarioDashboard.config.js)

The aim of this file is to allow the scenario screen dashboard configuration.
Same behavior as **Dashboards screen configuration**, if you want to pass ScenarioName and ScenarioId as parameters (for filtering purpose), you can use respective tags `<ScenarioName>` and `<ScenarioId>` .

## i18next configuration (i18next.config.js)
The aim of this file is to allow the react-i18next library configuration.
If you want further information, please check this [link](https://react.i18next.com/latest/using-with-hooks#configure-i-18-next)
