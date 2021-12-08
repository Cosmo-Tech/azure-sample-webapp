# App behavior configuration

## Edit configuration files

The file [src/config/AppConfiguration.js](../src/config/AppConfiguration.js) defines constants specific to your
application instance: you will need to change these values when creating a new staging or prod version of your
application.

- **LANGUAGES** is a dict describing the languages available in your webapp (e.g. {en: 'English', fr: 'Français'})
- **FALLBACK_LANGUAGE** is the default language to use when the user language can't be detected
- **SCENARIO_STATUS_POLLING_DELAY** is the delay to wait between two requests to the Cosmo Tech API when a scenario is
  running and the webapp is polling for a status update. Its value is expressed in milliseconds
- **POWER_BI_INFO_POLLING_DELAY** is the delay to wait between two requests to Power BI Services when Power BI information are fetched and an error occurs.
  Its value is expressed in milliseconds
- **SCENARIO_RUN_LOG_TYPE** is the type of logs to get, when downloading the logs of a scenario run (SIMPLE_LOGS or
  CUMULATED_LOGS)
- **SUPPORT_URL** is the url (expressed as a string) of the support page that can be get in the help menu symbolysed by a "?".
  If this value is set to null, the item is disabled and not displayed.
- **DOCUMENTATION_URL** is the relative path to the documentation file from the 'public' folder, located at the project's root. _In this example the default doc.pdf file is located directly in the 'public' folder, so the DOCUMENTATION_URL path value is 'doc.pdf'_.

### Additional scenario run parameters

- **ADD_SCENARIO_NAME_PARAMETER** send (or not) additional scenario parameter named `ScenarioName` (containing the scenario name) when a scenario is launched (**false** by default)
- **ADD_SCENARIO_ID_PARAMETER** send (or not) additional scenario parameter named `ScenarioId` (containing the scenario id) when a scenario is launched (**false** by default)
- **ADD_SCENARIO_PARENT_ID_PARAMETER** send (or not) additional scenario parameter named `ParentId` (containing the scenario parent id of the current scenario) when a scenario is launched (**false** by default, `''` if the scenario has no parent)
- **ADD_SCENARIO_MASTER_ID_PARAMETER** send (or not) additional scenario parameter named `MasterId` (containing the scenario master id of the current scenario) when a scenario is launched (**false** by default, `''` if the scenario has no master)
- **ADD_SCENARIO_RUN_TEMPLATE_NAME_PARAMETER** send (or not) additional scenario parameter named `RunTemplateName` (containing the run template name of the current scenario) when a scenario is launched (**false** by default)
- **ADD_SCENARIO_LAST_RUN_ID_PARAMETER** send (or not) additional scenario parameter named `ScenarioLastRunId` (containing the last run id for the current scenario) when a scenario is launched (**false** by default, `''` if the scenario has not been launched yet)
- **ADD_SCENARIO_PARENT_LAST_RUN_ID_PARAMETER** send (or not) additional scenario parameter named `ParentLastRunId` (containing the last run id for the parent of the current scenario) when a scenario is launched (**false** by default, `''` if the parent of the current scenario has not been launched yet)
- **ADD_SCENARIO_MASTER_LAST_RUN_ID_PARAMETER** send (or not) additional scenario parameter named `MasterLastRunId` (containing the last run id for the master of the current scenario) when a scenario is launched (**false** by default, `''` if the master of the current scenario has not been launched yet)

### Power BI

Parameter to define Power BI usages:

- **USE_POWER_BI_WITH_USER_CREDENTIALS** defines if the information sent to Power BI (mainly for authentication) are based on user credentials or based on a service account

### Application Insights

Parameter to enable Application Insights in the webapp:

- **ENABLE_APPLICATION_INSIGHTS** defines if Application Insights is enabled in WebApp
