# Application Insights

Our application uses Application Insights, an Azure service, to monitor some user actions and webapp performance. This service can be activated/deactivated for your application:
- in the Azure portal:
    - open the page of your Static Web Apps instance
    - select "Application Insights" in the left panel
    - select "Yes" next to "Enable Application Insights" (see note below if you can't enable Application Insights)
    - click on "Save"
- then, edit the configuration file [src/config/ApplicationInsights.js](../src/config/ApplicationInsights.js) in the source code of your webapp:
    - replace the value of **APPLICATION_INSIGHTS_INSTRUMENTATION_KEY** with the instrumentation key that has been
      generated for your application
    - set **ENABLE_APPLICATION_INSIGHTS** to true

> Note: in the Azure portal, if you can't enable Application Insights and encounter an error message such as "_App
> Insights is only applicable to Static Web Apps with at least one function_", please **check that the value of
> "api_location" parameter is set to "api"** in your GitHub Actions workflow file, in the .github/workflows folder.

For further information on how to consult these custom metrics, see: [How to view logs and metrics in Application Insights](https://azure.github.io/Industrial-IoT/tutorials/tut-applicationinsights.html#view-metrics-in-application-insights).

The documentation below lists the custom metrics and what user actions trigger each one of them.
## Upload

This event is triggered each time a user uploads a file in datasets tab (`Browse` button) or editable table tab (`Import file` button) in Scenario parameters section. See [Scenario Parameters Configuration - File parameters](https://github.com/Cosmo-Tech/azure-sample-webapp/blob/main/doc/scenarioParametersConfiguration.md#file-parameters).

In Application Insights Portal, this event is labeled **UploadFileValue**.

## Download

This event is triggered each time a user downloads a file, by clicking on the `Download` button, within a Scenario Parameters tab. This does not apply to tabs containing an editable table. See [Scenario Parameters Configuration - File parameters](https://github.com/Cosmo-Tech/azure-sample-webapp/blob/main/doc/scenarioParametersConfiguration.md#file-parameters).

In Application Insights Portal, this event is labeled **DownloadFileValue**.

## Create a new scenario

This event is triggered each time a user creates a new scenario, i.e. when clicking on the `Create` button from the scenario creation dialog.

In Application Insights Portal, this event is labeled **CreateScenarioValue**.

## Launch a scenario

This event is triggered each time a user launches a scenario, either by clicking `Launch` or `Update and launch` buttons.

In Application Insights Portal, this event is labeled **LaunchScenarioValue**.

## Duration of a scenario run

The duration is measured between the moment the user has clicked on the `Launch` button, and the moment the application has detected the related scenario status to be either "Successful" or "Error".

Note: The measured run duration can be higher than the real duration. Indeed, once the scenario has been launched, the application will check the scenario's status regularly at a specific time interval. Thus, the run duration measurement error is inferior or equal to this interval.

In Application Insights Portal, this event is labeled **RunDurationValue**.
