# Configure Dashboards view

The Dashboards view allows to embed multiple BI reports in the app using their URL. The examples we provide in this sample webapp are based on [PowerBI](https://powerbi.microsoft.com/fr-fr/getting-started-with-power-bi/).

## Dashboard entries structure
To add an entry in the Dashboards view menu:
- Open *webapp_folder*/src/configs/DashboardsList.config.js
- Add a new object in the existing DASHBOARDS_LIST_CONFIG array, respecting the following pattern:
```
{
  id: <unique id>,          // Incrementing the previous id
  title: '<title>',         // Dashboard's title that appears in left tabs
  url: '<url_powerbi>'      // PowerBI url, explained below
}
```
## How to get the right URL for embedding with PowerBI
* You need a PowerBI Pro license
* In PowerBI online service, click File > Embed report > Website or Portal
* You get the embedded report URL `MyReportURL`
* In PowerBI online, look at the end of your report's URL to get the section name. It should look like `/ReportSection`
* The URL you need to use for `url`key is then: `MyReportURL&pageName=ReportSection`

## How to use placeholders to filter results on the current scenario
You can filter a particular field on a value using [PowerBI URL filters](https://docs.microsoft.com/en-us/power-bi/collaborate-share/service-url-filters) (but need to follow the [syntax compatible with embedded reports](https://docs.microsoft.com/en-us/power-bi/collaborate-share/service-embed-secure#filter-report-content-using-url-filters)).

To filter results on the current scenario (selected by user in Scenario view drop-down), you need:
* a field in results database containing scenarios identifiers
* a placeholder to use in URL which will be dynamically replaced with the current scenario's identifier. Available placeholders are:
  * `<ScenarioName>`: will be dynamically replaced with the user-given current scenario name
  * `<ScenarioId>`: will be dynamically replaced with the unique Scenario identifier created returned by the platform at scenario creation

Use the following syntax: `MyReportURL&$filter=MyTableName/MyIdentifierField%20eq%20%27<ScenarioName>%27` (%20 is " " and %27 is "'")

## Complete example
```
  {
    id: 0,
    title: 'Dashboard 1',
    url: 'https://app.powerbi.com/reportEmbed?reportId=4f064d6a-2238-4e8f-8fee-8340f5a4800f&autoAuth=true&ctid=e413b834-8be8-4822-a370-be619545cb49&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXdlc3QtZXVyb3BlLWItcHJpbWFyeS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D&pageName=ReportSection&$filter=Demands/ScenarioName%20eq%20%27<ScenarioName>%27'
  }
```

## Other useful filter options
* `&filterPaneEnabled=false`: hides the filter right pane
* `&navContentPaneEnabled=false`: hides the pages bottom pane
