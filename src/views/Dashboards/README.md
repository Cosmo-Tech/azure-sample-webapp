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

The `<ScenarioName>` string will be automatically replaced with the real current scenario name, each time a scenario is selected in the Scenario view, and the Dashboards will be updated.