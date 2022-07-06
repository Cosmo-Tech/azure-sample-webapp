# PowerBI configuration
The embedded [PowerBI](https://powerbi.microsoft.com/fr-fr/getting-started-with-power-bi/) component
displays the results of scenario runs. 
## General configuration

### GetEmbedInfo
To retrieve reports information from PowerBI regarding a specific PowerBI workspace, you'll need to specify several environment 
variables used by the [Azure Functions](apiAzureFunctions.md) (Azure Portal > Static Web Apps > _name_of_your_webapp_ > Configuration).
Here is the list of these variables:

- POWER_BI_SCOPE : "https://analysis.windows.net/powerbi/api/.default"
- POWER_BI_CLIENT_ID : the client id
- POWER_BI_WORKSPACE_ID : The Power BI workspace targeted
- POWER_BI_AUTHORITY_URI : "https://login.microsoftonline.com/common/v2.0"
- POWER_BI_CLIENT_SECRET : a client secret
- POWER_BI_TENANT_ID : the tenant id

_**N.B.1**_:

You can get the information for POWER_BI_WORKSPACE_ID in PowerBI service URL:
- You get the embedded report URL `MyReportURL`
- The values you need to use for `POWER_BI_WORKSPACE_ID` key is group part in report `MyReportURL`

To get the information about POWER_BI_TENANT_ID and POWER_BI_CLIENT_SECRET:
- Azure Portal > App Registrations > _name_of_your_app_registration_ > Overview -> displays Application (client) id and Directory (tenant) ID
- Azure Portal > App Registrations > _name_of_your_app_registration_ > Certificates & secrets > create your client secret for PowerBI

_**N.B.2**_:

If you want to run the webapp locally and visualize the embedded dashboards, you need to install Azure Functions Core Tools: [instructions on this page](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local)

In particular, for local configuration, create a _**local.settings.json**_ file in **api** repository with the following content:

```json
{
  "IsEncrypted": false,
  "Values": {
    "POWER_BI_SCOPE": "https://analysis.windows.net/powerbi/api/.default",
    "POWER_BI_CLIENT_ID": "<CLIENT_ID>",
    "POWER_BI_WORKSPACE_ID": "<POWER_BI_ID>",
    "POWER_BI_AUTHORITY_URI": "https://login.microsoftonline.com/common/v2.0",
    "POWER_BI_CLIENT_SECRET": "<CLIENT_SECRET>",
    "POWER_BI_TENANT_ID": "<TENANT_ID>"
  }
}
```

Once you configured all Azure Functions variables, in the [src/config/PowerBI.js](/src/config/PowerBI.js) file define constants necessary
to display PowerBI embedded component:

- **USE_POWER_BI_WITH_USER_CREDENTIALS** defines if the information sent to Power BI (mainly for authentication) are based on user credentials or based on a service account
- **POWER_BI_WORKSPACE_ID** if _USE_POWER_BI_WITH_USER_CREDENTIALS_ is set to `true`, it represents the Power BI workspace ID used
- **SCENARIO_VIEW_IFRAME_DISPLAY_RATIO** defines the width/height ratio for the PowerBI iframe in the _Scenario_ view. This value must be a number, but you can use JS to compute it in the configuration file (e.g. for a 16:9 ratio, you can write `export const SCENARIO_VIEW_IFRAME_DISPLAY_RATIO = 16 / 9;`)
- **DASHBOARDS_VIEW_IFRAME_DISPLAY_RATIO** defines the width/height ratio for the PowerBI iframe in the _Dashboards_ view. This value must be a number, but you can use JS to compute it in the configuration file (e.g. for a 16:9 ratio, you can write `export const DASHBOARDS_VIEW_IFRAME_DISPLAY_RATIO = 16 / 9;`)

## Dashboards configuration
PowerBI reports can be embedded in the _Scenario_ and _Dashboards_ pages.

In Scenario view PowerBI report is supposed to display the results of the currently selected scenario, after it has run;
you can set a specific configuration for each run template or a general one for all scenarios.

The Dashboards view offers a menu to let users switch between several reports, that can
typically be used for in-depth results analysis or to compare the results of several scenarios.

### Configuration object
Configuration objects are similar for the Scenario view and for the Dashboards view:

```
  {
    title: {                              // report title in the Dashboards view (data not used for Scenario view)
      en: <english title>,
      fr: <french title>
    },
    reportId: <report unique id>,         // report Id can be found in PowerBI, in the URL of your report
    settings: '<settings object>',        // a settings object (see https://github.com/microsoft/powerbi-models/blob/0d326572c4253fd9f89b73a0d8df1ae46318a860/src/models.ts#L1070)
    staticFilters?: <filters array>,      // an array of PowerBIReportEmbedSimpleFilter and/or PowerBIReportEmbedMultipleFilter from @cosmotech/core dependency
    dynamicFilters?: <filters array>,     // an array of PowerBIReportEmbedSimpleFilter and/or PowerBIReportEmbedMultipleFilter from @cosmotech/core dependency
    pageName: {
      en: <section id for english version>     // the report section that you want to display when current language is English; it can be found in the URL of your report
      fr: <section id for french version>      // the report section that you want to display when current language is French; it can be found in the URL of your report
    }
  }
```
### Dashboard view
**_DASHBOARDS_LIST_CONFIG_** must be an array with one or several configuration objects inside.
### Scenario view
If only one configuration will be used for all run templates, **_SCENARIO_DASHBOARD_CONFIG_** can be an array with the configuration object inside:
```
export const SCENARIO_DASHBOARD_CONFIG = [
  {
    title: {
      en: <english title>,
      fr: <french title>,
      },
    reportId: <report unique id>,
    settings: <settings object>,
    staticFilters: <filters array>,
    dynamicFilters: <filters array>,
    pageName: {
      en: <section id for english version>,
      fr: <section id for french version>,
    },
  },
];
```
If the configuration differs from one run template to another, **_SCENARIO_DASHBOARD_CONFIG_** must be an object with all possible configuration objects
identified by runTemplateId. Note that each run template needs a specific configuration object; if the same configuration is used for several run templates,
it can be declared in a special variable:
```
const defaultScenarioViewReport = {
  title: {
    en: <english title>,
    fr: <french title>,
  },
  reportId: <report unique id>,
  settings: <settings object>,
  staticFilters: <filters array>,
  dynamicFilters: <filters array>,
  pageName: {
    en: <section id for english version>,
    fr: <section id for french version>,
  },
};
export const SCENARIO_DASHBOARD_CONFIG = {
  1: {
    title: {
      en: <english title>,
      fr: <french title>,
    },
    reportId: <report unique id>,
    settings: <settings object>,
    staticFilters: <filters array>,
    dynamicFilters: <filters array>,
    pageName: {
      en: <section id for english version>,
      fr: <section id for french version>,
    },
  },
  2: defaultScenarioViewReport,
  3: defaultScenarioViewReport,
};
```

## How to get the information for embedding with PowerBI

Everything is available in PowerBI service URL:

- you get the embedded report URL `MyReportURL`
- the value you need to use for `reportId` key is `MyReportURL?reportId=<reportId>`
- to get the page name, open your report in PowerBI online, look at the end of your report's URL to get the page name. It should look like `/ReportSection`

## Report page size recommendation

For Scenario View iframe:

- Select option: View > fit to page
- Select Format > Page size > Custom
    - Width: 1580 px
    - Height: 350 px

For Dashboard View iframes:

- Select option: View > fit to page
- Select Format > Page size > Custom
    - Width: 1280 px
    - Height: 795 px

Note that you can set a fixed display ratio for these PowerBI iframes by setting the parameters
`SCENARIO_VIEW_IFRAME_DISPLAY_RATIO` and `DASHBOARDS_VIEW_IFRAME_DISPLAY_RATIO`.

## How to use filters on the current scenario (dynamic Filter)

### PowerBIReportEmbedSimpleFilter

You can filter a particular field on a value using the PowerBIReportEmbedSimpleFilter class.
For example, you want to filter the SimulationRun column of StockProbe table on the current scenario last simulation run id.
You can add the following filter in the dynamicFilters array:

```javascript
new PowerBIReportEmbedSimpleFilter('StockProbe', 'SimulationRun', POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN);
```

Here is the list of all available scenario filters:

- SCENARIO_ID // The current scenario id
- SCENARIO_CSM_SIMULATION_RUN // The current last run scenario id
- SCENARIO_STATE // The current scenario state
- SCENARIO_NAME // The current scenario name
- SCENARIO_MASTER_ID // The current scenario master id (the id of the corresponding root scenario in the scenario tree)
- SCENARIO_PARENT_ID // The current scenario parent id (the id of the direct parent scenario in the scenario tree)
- SCENARIO_OWNER_ID // The current scenario owner id
- SCENARIO_SOLUTION_ID // The current scenario solution id

### PowerBIReportEmbedMultipleFilter

You can filter a particular field on values the PowerBIReportEmbedMultipleFilter class.
For example, you want to filter the id column of Simulation table on the current scenario id, parent id or master id.
You can add the following filter in the dynamicFilters array:

```javascript
new PowerBIReportEmbedMultipleFilter('Simulation', 'id', [
  POWER_BI_FIELD_ENUM.SCENARIO_ID,
  POWER_BI_FIELD_ENUM.SCENARIO_PARENT_ID,
  POWER_BI_FIELD_ENUM.SCENARIO_MASTER_ID
]);
```

### Custom filters

If you want to add a custom filter (neither PowerBIReportEmbedSimpleFilter nor PowerBIReportEmbedMultipleFilter) in staticFilters or dynamicFilters fields, you can but need to follow the [syntax compatible with embedded reports](https://github.com/microsoft/powerbi-models/blob/0d326572c4253fd9f89b73a0d8df1ae46318a860/src/models.ts#L338).
For example, you can add a [IRelativeDateTimeFilter](https://github.com/microsoft/powerbi-models/blob/0d326572c4253fd9f89b73a0d8df1ae46318a860/src/models.ts#L373) following this pattern:

```javascript
{
    $schema: string,
    target: IFilterGeneralTarget,
    filterType: FilterType,
    displaySettings?: IFilterDisplaySettings,
    operator: RelativeDateOperators,
    timeUnitsCount?: number,
    timeUnitType: RelativeDateFilterTimeUnit,
}
```

See [PowerBI models](https://github.com/microsoft/powerbi-models) for further details

## How to use static filters

The static filters are based on the same mechanism that dynamic filters.
The only exception is that they are not relative to the current scenario.
It's recommended to use them when you have a constant value that you want to use for a specific column.
For example, let us create a dummy one that filter on Simulation with exact id to 5. If you want to do that, you can add the following filter in the staticFilters array:

```javascript
new PowerBIReportEmbedSimpleFilter('Simulation', 'id', 5);
```

## Complete example

```js
[
  {
    title: {
      en: 'Report sample 1',
      fr: 'Exemple de rapport 1',
    },
    reportId: '608b7bef-f5e3-4aae-b8db-19bbb38325d5',
    settings: {
      navContentPaneEnabled: false,  // hides the pages bottom pane
      panes: {
        filters: {
          expanded: true,             // expands the filter right pane
          visible: true               // shows the filter right pane
        }
      }
    },
    staticFilters: [
      new PowerBIReportEmbedMultipleFilter('Bar', 'id', ['MyBar', 'MyBar2'])
    ],
    dynamicFilters: [
      new PowerBIReportEmbedSimpleFilter('StockProbe', 'SimulationRun', POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN)
    ],
    pageName: {
      en: 'ReportSection',
      fr: 'ReportSection'
    }
  }
]
```