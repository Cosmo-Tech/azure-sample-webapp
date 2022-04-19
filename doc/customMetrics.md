# Custom metrics

Our application uses Application Insights, an Azure service, to monitor some user actions and webapp performance. This documentation lists the custom metrics and what user actions trigger each one of them.
This service can be activated/deactivated following this tutorial: [App instance configuration - Application Insights](https://github.com/Cosmo-Tech/azure-sample-webapp/blob/main/doc/appInstance.md#application-insights).

For further information on how to consult these custom metrics, see: [How to view logs and metrics in Application Insights](https://azure.github.io/Industrial-IoT/tutorials/tut-applicationinsights.html#view-metrics-in-application-insights).

## Upload

This event is triggered each time a user uploads a file, by clicking on the `Upload` button, within a Scenario Parameters tab. This does not apply to tabs containing an editable table. See [Scenario Parameters Configuration - File parameters](https://github.com/Cosmo-Tech/azure-sample-webapp/blob/main/doc/scenarioParametersConfiguration.md#file-parameters).

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

Note: The measured run duration can be higher than the real duration. Indeed, once the scenario has been launched, the application will check the scenario's status regularly, at a time interval set by the variable **SCENARIO_STATUS_POLLING_DELAY**; see [https://github.com/Cosmo-Tech/azure-sample-webapp/blob/main/doc/appConfiguration.md#edit-configuration-files](App Behavior configuration). Thus, the run duration measurement error is inferior or equal to **SCENARIO_STATUS_POLLING_DELAY**.

In Application Insights Portal, this event is labeled **RunDurationValue**.
