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
You can add entries in the DASHBOARDS_LIST_CONFIG array.

Sample with [PowerBI dashboard URL](https://powerbi.microsoft.com/fr-fr/getting-started-with-power-bi/):

```
  {
    id: 0,
    title: 'Dashboard 1',
    url: 'https://app.powerbi.com/reportEmbed?reportId=4f064d6a-2238-4e8f-8fee-8340f5a4800f&autoAuth=true&ctid=e413b834-8be8-4822-a370-be619545cb49&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXdlc3QtZXVyb3BlLWItcHJpbWFyeS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D&pageName=ReportSection&$filter=Demands/Scenario_x0020_Name%20eq%20%27<ScenarioName>%27'
  }
```
In the URL, if you want to pass ScenarioName and ScenarioId as parameters (for filtering purpose), you can use respective tags `<ScenarioName>` and `<ScenarioId>` like above

## Scenario screen dashboard configuration (ScenarioDashboard.config.js)

The aim of this file is to allow the scenario screen dashboard configuration.
Same behavior as **Dashboards screen configuration**, if you want to pass ScenarioName and ScenarioId as parameters (for filtering purpose), you can use respective tags `<ScenarioName>` and `<ScenarioId>` .

## i18next configuration (i18next.config.js)
The aim of this file is to allow the react-i18next library configuration.
If you want further information, please check this [link](https://react.i18next.com/latest/using-with-hooks#configure-i-18-next)
