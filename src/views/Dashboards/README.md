# Configure Dashboards view

- Open *webapp_folder*/src/configs/DashboardsList.config.js
- Add a new object in the existing array, respecting the following pattern:
```
{
  id: <unique id>,          // Incrementing the previous id
  title: '<title>',         // Dashboard's title that appears in left tabs
  url: '<url_powerbi>'      // PowerBI url, explained below
}
```

In order to filter the results, at the end of the PowerBI URL, just add the exact following part:
```
/Scenario_x0020_Name%20eq%20%27<ScenarioName>%27
```

`Scenario_x0020_Name` is a name in your ADX database, and can change according to your needs.
For more information, please consult https://docs.microsoft.com/en-us/power-bi/collaborate-share/service-embed-secure#filter-report-content-using-url-filters and for more details about filtering, please consult https://docs.microsoft.com/en-us/power-bi/collaborate-share/service-url-filters .

The `<ScenarioName>` string will be automatically replaced with the real current scenario name, each time a scenario is selected in the Scenario view, so that the Dashboards will be updated.

If you want to use the ID returned by the platform when the scenario is created, instead of a name, use the following:
 ```
/Scenario_x0020_ID%20eq%20%27<ScenarioId>%27
```