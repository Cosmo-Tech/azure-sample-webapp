# App behavior configuration

## Edit configuration files
The file [src/config/AppConfiguration.js](../src/config/AppConfiguration.js) defines constants specific to your
application instance: you will need to change these values when creating a new staging or prod version of your
application.

* **LANGUAGES** is a dict describing the languages available in your webapp (e.g. {en: 'English', fr: 'Français'})
* **FALLBACK_LANGUAGE** is the default language to use when the user language can't be detected
* **SCENARIO_STATUS_POLLING_DELAY** is the delay to wait between two requests to the Cosmo Tech API when a scenario is
  running and the webapp is polling for a status update. Its value is expressed in milliseconds
* **POWER_BI_INFO_POLLING_DELAY** is the delay to wait between two requests to Power BI Services when Power BI information are fetched and an error occurs.
  Its value is expressed in milliseconds
* **SCENARIO_RUN_LOG_TYPE** is the type of logs to get, when downloading the logs of a scenario run (SIMPLE_LOGS or
  CUMULATED_LOGS)
