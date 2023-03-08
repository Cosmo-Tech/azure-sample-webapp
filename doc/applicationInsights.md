# Application Insights

Our application uses _Application Insights_, an Azure service, to monitor some user actions and webapp performance.
This service is **disabled by default**, but you can enable it for your application.

## Setup

In the Azure portal:

- open the page of your Static Web App instance
- select "_Application Insights_" in the left panel
- select "_Yes_" next to "_Enable Application Insights_" (see note below if you can't enable Application Insights)
- click on "_Save_"

Then, edit the configuration file [src/config/ApplicationInsights.json](../src/config/ApplicationInsights.json) in the
source code of your webapp:

- replace the value of `APPLICATION_INSIGHTS_INSTRUMENTATION_KEY` with the instrumentation key that has been
  generated for your application
- set `ENABLE_APPLICATION_INSIGHTS` to `true`

> Note: in the Azure portal, if you can't enable Application Insights and encounter an error message such as "_App
> Insights is only applicable to Static Web Apps with at least one function_", please **check that the value of
> "api_location" parameter is set to "api"** in your GitHub Actions workflow file, in the "_.github/workflows folder_".

The monitoring will then be enabled for your webapp. For further information on how to consult these custom metrics,
see:
[How to view logs and metrics in Application Insights](https://azure.github.io/Industrial-IoT/tutorials/tut-applicationinsights.html#view-metrics-in-application-insights).

## Custom metrics

This section lists the **custom metrics** provided by the _azure-sample-webapp_, and what user actions trigger each on
of them.

### File upload

This event is triggered each time a user uploads a file for scenario parameters of type "file upload" (_via_ the
"_Browse_" button) and "editable table" (_via_ the "_Import file_" button), in the scenario parameters panel.
See
[Scenario Parameters Configuration - File parameters](https://github.com/Cosmo-Tech/azure-sample-webapp/blob/main/doc/scenarioParametersConfiguration.md#file-parameters) for more details on these parameters types.

In Application Insights Portal, this event is labeled **UploadFileValue**.

### File download

This event is triggered each time a user downloads a file for scenario parameters of type "file upload" (by clicking on the "_Download_" button),in the scenario parameters panel. This does not apply to editable tables. See
[Scenario Parameters Configuration - File parameters](https://github.com/Cosmo-Tech/azure-sample-webapp/blob/main/doc/scenarioParametersConfiguration.md#file-parameters) for more details on files parameters.

In Application Insights Portal, this event is labeled **DownloadFileValue**.

### Scenario creation

This event is triggered each time a user creates a new scenario, i.e. when clicking on the "_Create_" button from the scenario creation dialog.

In Application Insights Portal, this event is labeled **CreateScenarioValue**.

### Scenario run

This event is triggered each time a user launches a scenario, either by clicking "_Launch_" or "_Update and launch_" buttons.

In Application Insights Portal, this event is labeled **LaunchScenarioValue**.

### Scenario run duration

The duration is measured between the moment the user has clicked on the "_Launch_" button, and the moment the application
has detected the related scenario status to be either "Successful" or "Error".

Notes:

- the measured run duration can be higher than the real duration. Indeed, once the scenario has been launched, the
  application will check the scenario's status regularly at a specific time interval. Thus, the run duration measurement
  error is inferior or equal to this interval.
- if a user closes the webapp before the end of the scenario run, the metric point for this run will not be registered

In Application Insights Portal, this event is labeled **RunDurationValue**.
