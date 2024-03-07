# PowerBI reports

The azure-sample-webapp provides users with embedded
[PowerBI](https://powerbi.microsoft.com/fr-fr/getting-started-with-power-bi/) reports in the _Scenario_ and
_Dashboards_ pages to **display the results of scenario runs**:

- in the _Scenario_ page, PowerBI reports usually display the results of the currently selected scenario, after it has
  run; you can either define a specific report to use for each run template, or display a generic report for all run
  templates
- the _Dashboards_ page offers a menu to let users switch between several reports; this view can typically be used for
  in-depth results analysis or to compare the results of several scenarios

For both pages, these reports must be configured **for each workspace**, directly in the _Workspace_ data declared to
the Cosmo Tech API (see section [Reports configuration](#reports-configuration)). Optionally, you can also "patch" the
configuration of an existing workspace by applying changes defined in your front-end configuration folder (see section
[Overriding the workspace configuration](#overriding-the-workspace-configuration)).

The webapp currently offers **two different modes** to retrieve PowerBI tokens: with the **identity of the connected
user**, or with a **service account**. Differences between these two modes and how to configure them is detailed in
section [PowerBI authentication strategies](#powerbi-authentication-strategies).

## Reports configuration

In your Workspace object data, the reports can be configured as an object in `[workspace].webApp.options.charts`. The
structure for this `charts` object is the following:

```js
{
  // in Workspace data
  // ...
  "charts": {
    "logInWithUserCredentials": true,
    "dashboardsViewIframeDisplayRatio": 1.6,
    "scenarioViewIframeDisplayRatio": 4.5,
    "workspaceId": "powerbi-workspace-id",
    "dashboardsView": [
      // ...
    ],
    "scenarioView": {
      // ...
    }
  }
}
```

| Key                                | Value description                                                                                                                                                             |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `logInWithUserCredentials`         | boolean defining if we must use "user account" (true) or "service account" mode (false) (see section [PowerBI authentication strategies](#powerbi-authentication-strategies)) |
| `dashboardsViewIframeDisplayRatio` | number defining the width/height ratio for the report iframe in the _Dashboards_ page                                                                                         |
| `scenarioViewIframeDisplayRatio`   | number defining the width/height ratio for the report iframe in the _Scenario_ page                                                                                           |
| `workspaceId`                      | id of the PowerBI workspace containing your reports                                                                                                                           |
| `dashboardsView`                   | array of reports to display in the _Dashboards_ page (see section [Dashboards page reports configuration](#dashboards-page-reports-configuration))                            |
| `scenarioView`                     | dict or array of reports to display in the _Scenario_ page (see section [Scenario page report configuration](#scenario-page-report-configuration))                            |

### Report configuration object

For both _Scenario_ and _Dashboards_ pages, the reports objects inside `scenarioView` and `dashboardsView` properties
expect the same structure:

```js
// Structure representing a single PowerBI report
{
  title: {
    en: "english title",
    fr: "french title",
  },
  reportId: "report-unique-id",
  settings: { /* options here */ },
  staticFilters: [ /* static filters */ ],
  dynamicFilters: [ /* dynamic filters */ ],
  pageName: {
    en: "report-section-unique-id",
    fr: "report-section-unique-id",
  }
}
```

| Key              | Value description                                                                                                                                                                |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`          | report title, per language, to display in the let menu in the Dashboards view (it is not used for reports in Scenario view)                                                      |
| `reportId`       | id of the report; it can be found in PowerBI, in the URL of your report: `myReportURL?reportId=<reportId>`                                                                       |
| `settings`       | an object to configure the [PowerBI report settings](https://github.com/microsoft/powerbi-models/blob/0d326572c4253fd9f89b73a0d8df1ae46318a860/src/models.ts#L1070)              |
| `staticFilters`  | an array of static filters objects (see section [Static filters](#static-filters))                                                                                               |
| `dynamicFilters` | an array of dynamic filters objects (see section [Dynamic filters](#dynamic-filters))                                                                                            |
| `pageName`       | the report section that you want to display, per language; it can be found in the URL of your report, and usually looks like `ReportSection` or `ReportSection0123456789abcdef`. |

This structure is used to define **reports**, that are a part of the `scenarioView` and `dashboardsView`

### Dashboards page reports configuration

**dashboardsView** must be an array with one or several configuration objects inside: each report in the array will add
an item in the menu on the left-side of the screen in the _Dashboards_ page.

Examples:

<details>
<summary>Dashboards page configuration - JSON</summary>

```json
{
  "dashboardsView": [
    {
      "title": { "en": "Digital Twin Structure", "fr": "Structure du jumeau numérique" },
      "reportId": "608b7bef-f5e3-4aae-b8db-19bbb38325d5",
      "settings": { "navContentPaneEnabled": false, "panes": { "filters": { "expanded": false, "visible": false } } },
      "pageName": { "en": "ReportSectionf3ef30b8ad34c9c2e8c4", "fr": "ReportSectionf3ef30b8ad34c9c2e8c4" }
    },
    {
      "title": { "en": "Stocks Follow-up", "fr": "Suivi de stock" },
      "reportId": "608b7bef-f5e3-4aae-b8db-19bbb38325d5",
      "settings": { "navContentPaneEnabled": false, "panes": { "filters": { "expanded": true, "visible": true } } },
      "dynamicFilters": [
        { "table": "StockProbe", "column": "SimulationRun", "values": "csmSimulationRun" },
        { "table": "Bar", "column": "simulationrun", "values": "csmSimulationRun" }
      ],
      "pageName": { "en": "ReportSectionca125957a3f5ea936a30", "fr": "ReportSectionca125957a3f5ea936a30" }
    },
    {
      "title": { "en": "Customer Satisfaction", "fr": "Satisfaction client" },
      "reportId": "608b7bef-f5e3-4aae-b8db-19bbb38325d5",
      "settings": { "navContentPaneEnabled": true, "panes": { "filters": { "expanded": false, "visible": true } } },
      "pageName": { "en": "ReportSectiond5265d03b73060af4244", "fr": "ReportSectiond5265d03b73060af4244" }
    }
  ]
}
```

</details>

<details>
<summary>Dashboards page configuration - YAML</summary>

```yaml
dashboardsView:
  - title:
      en: 'Digital Twin Structure'
      fr: 'Structure du jumeau numérique'
    reportId: '608b7bef-f5e3-4aae-b8db-19bbb38325d5'
    settings:
      navContentPaneEnabled: false
      panes:
        filters:
          expanded: false
          visible: false
    pageName:
      en: 'ReportSectionf3ef30b8ad34c9c2e8c4'
      fr: 'ReportSectionf3ef30b8ad34c9c2e8c4'
  - title:
      en: 'Stocks Follow-up'
      fr: 'Suivi de stock'
    reportId: '608b7bef-f5e3-4aae-b8db-19bbb38325d5'
    settings:
      navContentPaneEnabled: false
      panes:
        filters:
          expanded: true
          visible: true
    dynamicFilters:
      - table: 'StockProbe'
        column: 'SimulationRun'
        values: 'csmSimulationRun'
      - table: 'Bar'
        column: 'simulationrun'
        values: 'csmSimulationRun'
    pageName:
      en: 'ReportSectionca125957a3f5ea936a30'
      fr: 'ReportSectionca125957a3f5ea936a30'
  - title:
      en: 'Customer Satisfaction'
      fr: 'Satisfaction client'
    reportId: '608b7bef-f5e3-4aae-b8db-19bbb38325d5'
    settings:
      navContentPaneEnabled: true
      panes:
        filters:
          expanded: false
          visible: true
    pageName:
      en: 'ReportSectiond5265d03b73060af4244'
      fr: 'ReportSectiond5265d03b73060af4244'
```

</details>

### Scenario page report configuration

There are two ways to configure the report in the _Scenario_ page:

- if you want to use a **single report for all the run templates**, then `scenarioView` must be an array with a single
  report object inside it
- if you want to display a **different report for each run template**, then `scenarioView` must be a dict with run
  template ids as keys, and the associated report configuration object as value

Examples:

<details>
<summary>Scenario page configuration - Single report - JSON</summary>

```json
{
  "scenarioView": [
    {
      "title": { "en": "Scenario dashboard for run type 1", "fr": "Rapport de scénario du run type 1" },
      "reportId": "608b7bef-f5e3-4aae-b8db-19bbb38325d5",
      "settings": { "navContentPaneEnabled": false, "panes": { "filters": { "expanded": false, "visible": false } } },
      "staticFilters": [],
      "dynamicFilters": [],
      "pageName": { "en": "ReportSection937f9c72cc8f1062aa88", "fr": "ReportSection937f9c72cc8f1062aa88" }
    }
  ]
}
```

</details>

<details>
<summary>Scenario page configuration - Single report - YAML</summary>

```yaml
scenarioView:
  - title:
      en: 'Scenario dashboard for run type 1'
      fr: 'Rapport du scenario du run type 1'
    reportId: '608b7bef-f5e3-4aae-b8db-19bbb38325d5'
    settings:
      navContentPaneEnabled: false
      panes:
        filters:
          expanded: true
          visible: true
    staticFilters:
      - table: 'Bar'
        column: 'Bar'
        values:
          - 'MyBar'
          - 'MyBar2'
    dynamicFilters:
      - table: 'StockProbe'
        column: 'SimulationRun'
        values: 'csmSimulationRun'
      - table: 'contains_Customer'
        column: 'simulationrun'
        values: 'csmSimulationRun'
    pageName:
      en: 'ReportSection937f9c72cc8f1062aa88'
      fr: 'ReportSection937f9c72cc8f1062aa88'
```

</details>

<details>
<summary>Scenario page configuration - One report per run template - JSON</summary>

```json
{
  "scenarioView": {
    "1": {
      "title": { "en": "Scenario dashboard for run type 1", "fr": "Rapport de scénario du run type 1" },
      "reportId": "608b7bef-f5e3-4aae-b8db-19bbb38325d5",
      "settings": { "navContentPaneEnabled": false, "panes": { "filters": { "expanded": false, "visible": false } } },
      "staticFilters": [],
      "dynamicFilters": [],
      "pageName": { "en": "ReportSection937f9c72cc8f1062aa88", "fr": "ReportSection937f9c72cc8f1062aa88" }
    },
    "2": {
      "title": { "en": "Scenario dashboard for run type 2", "fr": "Rapport de scénario du run type 2" },
      "reportId": "608b7bef-f5e3-4aae-b8db-19bbb38325d5",
      "settings": { "navContentPaneEnabled": false, "panes": { "filters": { "expanded": false, "visible": true } } },
      "staticFilters": [],
      "dynamicFilters": [],
      "pageName": { "en": "ReportSection", "fr": "ReportSection" }
    },
    "3": {
      "title": { "en": "Scenario dashboard for run type 3", "fr": "Rapport de scénario du run type 3" },
      "reportId": "608b7bef-f5e3-4aae-b8db-19bbb38325d5",
      "settings": { "navContentPaneEnabled": false, "panes": { "filters": { "expanded": true, "visible": true } } },
      "staticFilters": [],
      "dynamicFilters": [],
      "pageName": { "en": "ReportSection", "fr": "ReportSection" }
    }
  }
}
```

</details>

<details>
<summary>Scenario page configuration - One report per run template - YAML</summary>

```yaml
scenarioView:
  'runTemplateId_1':
    title:
      en: 'Scenario dashboard for run type 1'
      fr: 'Rapport du scenario du run type 1'
    reportId: '608b7bef-f5e3-4aae-b8db-19bbb38325d5'
    settings:
      navContentPaneEnabled: false
      panes:
        filters:
          expanded: true
          visible: true
    staticFilters:
      - table: 'Bar'
        column: 'Bar'
        values:
          - 'MyBar'
          - 'MyBar2'
    dynamicFilters:
      - table: 'StockProbe'
        column: 'SimulationRun'
        values: 'csmSimulationRun'
      - table: 'contains_Customer'
        column: 'simulationrun'
        values: 'csmSimulationRun'
    pageName:
      en: 'ReportSection937f9c72cc8f1062aa88'
      fr: 'ReportSection937f9c72cc8f1062aa88'
  'runTemplateId_2':
    title:
      en: 'Scenario dashboard for run type 2'
      fr: 'Rapport du scenario du run type 2'
    reportId: '608b7bef-f5e3-4aae-b8db-19bbb38325d5'
    settings:
      navContentPaneEnabled: false
      panes:
        filters:
          expanded: true
          visible: true
    pageName:
      en: 'ReportSection'
      fr: 'ReportSection'
  'runTemplateId_3':
    title:
      en: 'Scenario dashboard for run type 3'
      fr: 'Rapport du scenario du run type 3'
    reportId: '608b7bef-f5e3-4aae-b8db-19bbb38325d5'
    settings:
      navContentPaneEnabled: false
      panes:
        filters:
          expanded: true
          visible: true
    pageName:
      en: 'ReportSection'
      fr: 'ReportSection'
```

</details>

### Use filters in reports

#### Static filters

**Static filters** let you filter a given field on a hard-coded value. You simply need to define an object with the **table** and **column** to filter, and the **filter value** to apply. The keys of this object are:

- `table`
- `column`
- `values` (plural, even though you can provide a single value)

It's recommended to use static filters when you have a constant value that you want to use for a specific column.

For example, the static filter below will only keep simulations with the id "5":

```json
{
  "staticFilters": [{ "table": "Simulation", "column": "id", "values": 5 }]
}
```

You can also provide a list of several allowed values:

```json
{
  "staticFilters": [{ "table": "Bar", "column": "Bar", "values": ["MyBar", "MyBar2"] }]
}
```

#### Dynamic filters

**Dynamic filters** can be context-dependent to filter rows based on various information, such as the currently selected
scenario, its parent or root scenarios, or even the scenarios available to the user in the webapp.

Here is the list of dynamic filters available:

| Filter name                            | Description                                                            |
| -------------------------------------- | ---------------------------------------------------------------------- |
| `id`                                   | _id_ of the current scenario                                           |
| `csmSimulationRun`                     | _csm run id_ of the last run of the current scenario                   |
| `state`                                | _state_ of the current scenario                                        |
| `name`                                 | _name_ of the current scenario                                         |
| `masterId`                             | _id_ of the root scenario of the current scenario                      |
| `parentId`                             | _id_ of the parent scenario of the current scenario                    |
| `ownerId`                              | _id_ of the user that created the current scenario                     |
| `solutionId`                           | _id_ of the solution                                                   |
| `visibleScenariosIds`                  | list of _ids_ of the scenarios visible to the user                     |
| `visibleScenariosSimulationRunsIds`    | list of _ids_ of the last run of scenarios visible to the user         |
| `visibleScenariosCsmSimulationRunsIds` | list of _csm run ids_ of the last run of scenarios visible to the user |

For example, you can filter the rows of several tables to only display the results of the last simulation run, by
using the `csmSimulationRun` dynamic filter:

```json
{
  "dynamicFilters": [
    { "table": "StockProbe", "column": "SimulationRun", "values": "csmSimulationRun" },
    { "table": "contains_Customer", "column": "simulationrun", "values": "csmSimulationRun" }
  ]
}
```

You can also restrict the displayed results in a dashboards to only show the scenarios accessible to the user:

```json
{
  "dynamicFilters": [
    { "table": "StockProbe", "column": "SimulationRun", "values": "visibleScenariosCsmSimulationRunsIds" }
  ]
}
```

#### Custom filters

If you want to add a custom filter (neither PowerBIReportEmbedSimpleFilter nor PowerBIReportEmbedMultipleFilter) in staticFilters or dynamicFilters fields, you can but need to follow the [syntax compatible with embedded reports](https://github.com/microsoft/powerbi-models/blob/0d326572c4253fd9f89b73a0d8df1ae46318a860/src/models.ts#L338).
For example, you can add a [IRelativeDateTimeFilter](https://github.com/microsoft/powerbi-models/blob/0d326572c4253fd9f89b73a0d8df1ae46318a860/src/models.ts#L373) following this pattern:

```js
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

See [PowerBI models](https://github.com/microsoft/powerbi-models) for further details.

## Complete example

You can find below a complete example of a workspace YAML description file, defining the PowerBI charts to use:

```yaml
key: 'brewerydevworkspace'
name: ' Brewery Dev Workspace'
solution:
  solutionId: 'SOL-VkqXyNONQyB'
description: 'A workspace for Brewery Dev'
sendInputToDataWarehouse: true
useDedicatedEventHubNamespace: true
sendScenarioMetadataToEventHub: true
webApp:
  url: 'https://sample.app.cosmotech.com'
  options:
    charts:
      workspaceId: '290de699-9026-42c0-8c83-e4e87c3f22dd'
      logInWithUserCredentials: false
      scenarioViewIframeDisplayRatio: 4.514285714285714
      dashboardsViewIframeDisplayRatio: 1.610062893081761
      dashboardsView:
        - title:
            en: 'Digital Twin Structure'
            fr: 'Structure du jumeau numérique'
          reportId: '608b7bef-f5e3-4aae-b8db-19bbb38325d5'
          settings:
            navContentPaneEnabled: false
            panes:
              filters:
                expanded: false
                visible: false
          pageName:
            en: 'ReportSectionf3ef30b8ad34c9c2e8c4'
            fr: 'ReportSectionf3ef30b8ad34c9c2e8c4'
        - title:
            en: 'Stocks Follow-up'
            fr: 'Suivi de stock'
          reportId: '608b7bef-f5e3-4aae-b8db-19bbb38325d5'
          settings:
            navContentPaneEnabled: false
            panes:
              filters:
                expanded: true
                visible: true
          dynamicFilters:
            - table: 'StockProbe'
              column: 'SimulationRun'
              values: 'csmSimulationRun'
            - table: 'Bar'
              column: 'simulationrun'
              values: 'csmSimulationRun'
          pageName:
            en: 'ReportSectionca125957a3f5ea936a30'
            fr: 'ReportSectionca125957a3f5ea936a30'
        - title:
            en: 'Customer Satisfaction'
            fr: 'Satisfaction client'
          reportId: '608b7bef-f5e3-4aae-b8db-19bbb38325d5'
          settings:
            navContentPaneEnabled: true
            panes:
              filters:
                expanded: false
                visible: true
          dynamicFilters:
            - table: 'StockProbe'
              column: 'SimulationRun'
              values: 'csmSimulationRun'
            - table: 'Bar'
              column: 'simulationrun'
              values: 'csmSimulationRun'
          pageName:
            en: 'ReportSectiond5265d03b73060af4244'
            fr: 'ReportSectiond5265d03b73060af4244'
      scenarioView:
        '1':
          title:
            en: 'Scenario dashboard for run type 1'
            fr: 'Rapport du scenario du run type 1'
          reportId: '608b7bef-f5e3-4aae-b8db-19bbb38325d5'
          settings:
            navContentPaneEnabled: false
            panes:
              filters:
                expanded: true
                visible: true
          staticFilters:
            - table: 'Bar'
              column: 'Bar'
              values:
                - 'MyBar'
                - 'MyBar2'
          dynamicFilters:
            - table: 'StockProbe'
              column: 'SimulationRun'
              values: 'csmSimulationRun'
            - table: 'contains_Customer'
              column: 'simulationrun'
              values: 'csmSimulationRun'
          pageName:
            en: 'ReportSection937f9c72cc8f1062aa88'
            fr: 'ReportSection937f9c72cc8f1062aa88'
        '2':
          title:
            en: 'Scenario dashboard'
            fr: 'Rapport du scenario'
          reportId: '608b7bef-f5e3-4aae-b8db-19bbb38325d5'
          settings:
            navContentPaneEnabled: false
            panes:
              filters:
                expanded: true
                visible: true
          staticFilters:
            - table: 'Bar'
              column: 'Bar'
              values:
                - 'MyBar'
                - 'MyBar2'
          dynamicFilters:
            - table: 'StockProbe'
              column: 'SimulationRun'
              values: 'csmSimulationRun'
            - table: 'Bar'
              column: 'simulationrun'
              values: 'csmSimulationRun'
          pageName:
            en: 'ReportSection'
            fr: 'ReportSection'
        '3':
          title:
            en: 'Scenario dashboard'
            fr: 'Rapport du scenario'
          reportId: '608b7bef-f5e3-4aae-b8db-19bbb38325d5'
          settings:
            navContentPaneEnabled: false
            panes:
              filters:
                expanded: true
                visible: true
          staticFilters:
            - table: 'Bar'
              column: 'Bar'
              values:
                - 'MyBar'
                - 'MyBar2'
          dynamicFilters:
            - table: 'StockProbe'
              column: 'SimulationRun'
              values: 'csmSimulationRun'
            - table: 'Bar'
              column: 'simulationrun'
              values: 'csmSimulationRun'
          pageName:
            en: 'ReportSection'
            fr: 'ReportSection'
```

## PowerBI authentication strategies

### Available authentication modes

The webapp currently supports **two different modes to retrieve the PowerBI token**:

- with the **identity of the connected user**
  - enables row-level security based on user identity
  - every user must have a valid PowerBI license
- by using a **service account** that provides users with tokens to access the requested reports
  - can't use row-level security based on user identity
  - users can access embedded reports without individual PowerBI licenses
  - an Azure Function must be configured to provide users with the PowerBI tokens

### Option 1 - User account

To use the "user account" mode, you only have to set the option `logInWithUserCredentials` to `true` in your workspace
charts configuration. When using this mode, you don't need to configure the `GetEmbedInfo` Azure Function.

### Option 2 - Service account

In order to securely provide webapp users with the "service account" token, an Azure Function needs to be deployed with
the webapp. The code of this Azure Function is already implemented in the azure-sample-webapp repository: it is called
`GetEmbedInfo`, and it can be found in the `api` folder. The sections below describe how to set parameters in your Azure
Static Web App instance to configure the deployed Azure Function, and how to run it locally.

#### Azure Function configuration in the Azure portal

The configuration of the [`GetEmbedInfo`](apiAzureFunctions.md) Azure Function can be done from your Static Web App
instance. Open the "_Configuration_" blade
(_Azure Portal_ > _Static Web Apps_ > _[name of your webapp]_ > _Configuration_), and add the environment variables
below:

| Parameter name           | Value description                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------- |
| `POWER_BI_SCOPE`         | "https://analysis.windows.net/powerbi/api/.default"                                   |
| `POWER_BI_CLIENT_ID`     | client id of the webapp app registration (visible in the _Overview_ blade)            |
| `POWER_BI_AUTHORITY_URI` | "https://login.microsoftonline.com/common/v2.0"                                       |
| `POWER_BI_CLIENT_SECRET` | a client secret generated in your app registration for PowerBI                        |
| `POWER_BI_TENANT_ID`     | tenant id of your app registration (visible in the _Overview_ blade)                  |
| `CSM_API_TOKEN_AUDIENCE` | (optional) if defined, queries whose token don't match this audience will be rejected |

For `POWER_BI_CLIENT_SECRET`, you can create a new client secret from
_Azure Portal_ > _App Registrations_ > _[name of your webapp app registration]_ > _Certificates & secrets_.

`CSM_API_TOKEN_AUDIENCE` is optional but strongly recommended. It increases security by checking the audience field in
the user access token. The expected value is the **application id** of the Cosmo Tech API enterprise application (you
can find this value in the Azure portal, in the "_Overview_" blade of the Cosmo Tech API application that your webapp
instance uses). The identifier value should have a pattern similar to `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`.

#### Azure Function configuration for local run

If you want to run the Azure Function locally to visualize the embedded dashboards from a local webapp, you first need
to install [Azure Functions Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local).

The local Azure Function configuration requires the same parameters as described in the previous section, stored in a
JSON file. Create a _**local.settings.json**_ file in the **api** folder with the following content:

```json
{
  "IsEncrypted": false,
  "Values": {
    "POWER_BI_SCOPE": "https://analysis.windows.net/powerbi/api/.default",
    "POWER_BI_CLIENT_ID": "INSERT CLIENT ID HERE",
    "POWER_BI_AUTHORITY_URI": "https://login.microsoftonline.com/common/v2.0",
    "POWER_BI_CLIENT_SECRET": "INSERT CLIENT SECRET HERE",
    "POWER_BI_TENANT_ID": "INSERT TENANT ID HERE",
    "CSM_API_TOKEN_AUDIENCE": "INSERT EXPECTED TOKEN AUDIENCE HERE"
  }
}
```

## Overriding the workspace configuration

Updating the workspace configuration via the Cosmo Tech API (with restish or swagger) can be a slow, cumbersome and
error-prone process. A simpler way to iterate on the dashboards configuration during development is to use the file
[src/config/overrides/Workspaces.js](../src/config/overrides/Workspaces.js). This file can be used to override the
configuration of any workspace, by patching the workspace data sent by the Cosmo Tech API.

Open the file and modify the `WORKSPACES` constant, that contains an array of workspace objects. These objects must
contain an `id` property, that will be used to patch the matching workspace sent by the API.

Here is an example of how to override the `charts` configuration via the
[src/config/overrides/Workspaces.js](../src/config/overrides/Workspaces.js) file:

```js
export const WORKSPACES = [
  {
    id: 'w-000000000',
    webApp: {
      options: {
        charts: {
          workspaceId: '00000000-0000-0000-0000-000000000000',
          logInWithUserCredentials: false,
          scenarioViewIframeDisplayRatio: 1580 / 350,
          dashboardsViewIframeDisplayRatio: 1280 / 795,
          dashboardsView: [
            {
              title: { en: 'Stocks Follow-up', fr: 'Suivi de stock' },
              reportId: '00000000-0000-0000-0000-000000000000',
              settings: { navContentPaneEnabled: false, panes: { filters: { expanded: true, visible: true } } },
              dynamicFilters: [],
              pageName: { en: 'ReportSectionca125957a3f5ea936a30', fr: 'ReportSectionca125957a3f5ea936a30' },
            },
          ],
          scenarioView: {
            myRunTemplateId: {
              title: { en: 'Scenario dashboard for run type 1', fr: 'Rapport de scénario du run type 1' },
              reportId: '00000000-0000-0000-0000-000000000000',
              settings: { navContentPaneEnabled: false, panes: { filters: { expanded: true, visible: true } } },
              staticFilters: [],
              dynamicFilters: [],
              pageName: { en: 'ReportSection12345', fr: 'ReportSection12345' },
            },
          },
        },
      },
    },
  },
];
```

This configuration will then be used when **running your webapp locally**, to quickly iterate on the configuration to
check your dashboards configuration. You can even commit these changes in your webapp repository to keep using this
"configuration patch" in **deployed webapps** (it can be useful for feature preview environments).

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
`scenarioViewIframeDisplayRatio` and `dashboardsViewIframeDisplayRatio`.

## Customizing Power BI themes

### Motivation
This webapp comes with a dark theme and a light one. Having a unique theme for Power BI, either a dark or a light one, would clash when the other one is used for the webapp theme.
The two themes switch according to the webapp theme switch, in order to give users a more unified experience, without having to duplicate any data.

The files `darkTheme.json` and `lightTheme.json` are provided, which offer the bare minimum color palettes. These files can then be customized, to achieve specific goals, according to one's reports charts look and feel.

### How to customize your own themes
If you want to customize the provided light and dark themes, simply modify the `src/theme/powerBI/(dark|light)Theme.json` files, according to your needs.

The Microsoft documentation on how to create report themes explains the overall syntax and general principles: [Use report themes in Power BI Desktop](https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-report-themes).

To go further, the following GitHub has a lot of showcases, which teaches what can be customized in extensive details: [pro-power-bi-theme-creation](https://github.com/Apress/pro-power-bi-theme-creation/blob/main/FullTheme.json).
