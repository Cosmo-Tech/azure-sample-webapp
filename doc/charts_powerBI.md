# PowerBI reports

_This page documents how to configure **PowerBI charts** to visualize simulation results in the webapp. For Superset,
the instructions are documented [here](charts_superset.md)._

The webapp currently offers **two different modes** to retrieve PowerBI tokens: with the **identity of the connected
user**, or with a **service account**. Differences between these two modes and how to configure them is detailed in
section [PowerBI authentication strategies](#powerbi-authentication-strategies).

## Workspace configuration

### Overview

In your Workspace, the reports can be configured in `additionalData.webapp.charts`. For PowerBI charts, the structure
for this `charts` object is the following:

```js
{
  // in Workspace data
  // ...
  "additionalData": {
    "webapp": {
      "charts": {
        "logInWithUserCredentials": true,
        "useWebappTheme": false,
        "dashboardsViewIframeDisplayRatio": 1.6,
        "scenarioViewIframeDisplayRatio": 4.5,
        "workspaceId": "<powerbi workspace id>",
        "dashboardsView": [
          // ...
        ],
        "scenarioView": {
          // ...
        }
      }
    }
  }
}
```

The existing options in `charts` are:

| Key                                | Value description                                                                                                                                                                                     |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `logInWithUserCredentials`         | boolean defining if we must use "user account" (true) or "service account" mode (false) (see section [PowerBI authentication strategies](#powerbi-authentication-strategies))                         |
| `useWebappTheme`                   | boolean defining if the webapp should apply custom theme files to embedded dashboards (disabled by default, see section [Customizing Power BI themes](#customizing-power-bi-themes) for more details) |
| `dashboardsViewIframeDisplayRatio` | number defining the width/height ratio for the report iframe in the _Dashboards_ page                                                                                                                 |
| `scenarioViewIframeDisplayRatio`   | number defining the width/height ratio for the report iframe in the _Scenario_ page                                                                                                                   |
| `workspaceId`                      | id of the PowerBI workspace containing your reports                                                                                                                                                   |
| `dashboardsView`                   | array of reports to display in the _Dashboards_ page (see section [Dashboards page reports configuration](#dashboards-page-reports-configuration))                                                    |
| `scenarioView`                     | dict or array of reports to display in the _Scenario_ page (see section [Scenario page report configuration](#scenario-page-report-configuration))                                                    |

### Report configuration structure

For both _Scenario_ and _Dashboards_ pages, the **report** objects inside `scenarioView` and `dashboardsView` properties
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

### Dashboard view

`dashboardsView` must be an array with one or several configuration objects inside: each report in the array will add
an item in the menu on the left-side of the screen in the _Dashboards_ page.

Examples:

<details>
<summary>Dashboard page configuration - JSON</summary>

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
        { "table": "StockProbe", "column": "SimulationRun", "values": "lastRunId" },
        { "table": "Bar", "column": "simulationrun", "values": "lastRunId" }
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
<summary>Dashboard page configuration - YAML</summary>

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
        values: 'lastRunId'
      - table: 'Bar'
        column: 'simulationrun'
        values: 'lastRunId'
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

### Scenario view

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
        values: 'lastRunId'
      - table: 'contains_Customer'
        column: 'simulationrun'
        values: 'lastRunId'
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
        values: 'lastRunId'
      - table: 'contains_Customer'
        column: 'simulationrun'
        values: 'lastRunId'
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
scenario, its parent or root scenarios, or even the scenarios available to the user in the webapp. For the full list of
available options, please see the [Filters](charts.md#filters) section in the page documenting common
configuration between PowerBI and Superset charts.

Here is an example of how to filter the rows of several tables to only display the results of the last simulation run, by
using the `lastRunId` dynamic filter:

```json
{
  "dynamicFilters": [
    { "table": "StockProbe", "column": "SimulationRun", "values": "lastRunId" },
    { "table": "contains_Customer", "column": "simulationrun", "values": "lastRunId" }
  ]
}
```

You can also filter the results in a report to show only the scenarios accessible to the user:

```json
{
  "dynamicFilters": [{ "table": "StockProbe", "column": "SimulationRun", "values": "visibleScenariosLastRunIds" }]
}
```

#### Complete example

You can find below a complete example of a workspace YAML description file, defining the PowerBI charts to use:

<details>
<summary>Scenario page configuration - One report per run template - YAML</summary>

```yaml
key: 'brewerydevworkspace'
name: ' Brewery Dev Workspace'
solution:
  solutionId: 'SOL-VkqXyNONQyB'
description: 'A workspace for Brewery Dev'
sendInputToDataWarehouse: true
useDedicatedEventHubNamespace: true
sendScenarioMetadataToEventHub: true
additionalData:
  webapp:
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
              values: 'lastRunId'
            - table: 'Bar'
              column: 'simulationrun'
              values: 'lastRunId'
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
              values: 'lastRunId'
            - table: 'Bar'
              column: 'simulationrun'
              values: 'lastRunId'
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
              values: 'lastRunId'
            - table: 'contains_Customer'
              column: 'simulationrun'
              values: 'lastRunId'
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
              values: 'lastRunId'
            - table: 'Bar'
              column: 'simulationrun'
              values: 'lastRunId'
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
              values: 'lastRunId'
            - table: 'Bar'
              column: 'simulationrun'
              values: 'lastRunId'
          pageName:
            en: 'ReportSection'
            fr: 'ReportSection'
```

</details>

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
charts configuration. When using this mode, you don't need to set up and configure any extra Azure Function.

### Option 2 - Service account

In order to securely provide webapp users with a "service account" token, an HTTP endpoint must be deployed with the
webapp. The azure-sample-webapp comes with a predefined Azure Function, that can either be deployed in the Azure cloud,
or run in on-premises Kubernetes clusters. This Azure Function is called `GetEmbedInfo`, and can be found in the _api_
folder. This section describes the existing configuration parameters of this Azure Function, how to set these parameters
when deployed with an Azure Static Web App, and how to run it locally.

## Service account configuration

### Configuration parameters

| Parameter name                                                    | Required                                              |
| ----------------------------------------------------------------- | ----------------------------------------------------- |
| [POWER_BI_TENANT_ID](#power-bi-tenant-id)                         | yes                                                   |
| [POWER_BI_CLIENT_ID](#power-bi-client-id)                         | yes                                                   |
| [POWER_BI_CLIENT_SECRET](#power-bi-client-secret)                 | yes                                                   |
| [AZURE_COSMO_API_APPLICATION_ID](#azure-cosmo-api-application-id) | required when using Azure authentication in webapp    |
| [KEYCLOAK_REALM](#keycloak-realm)                                 | required when using Keycloak authentication in webapp |

The `GetEmbedInfo` Function must be configured to validate the tokens sent from the webapp. Depending on whether your
webapp uses Azure or Keycloak for authentication, you must set **one** of these two parameters:
`AZURE_COSMO_API_APPLICATION_ID` (for Azure) or `KEYCLOAK_REALM` (for Keycloak).

#### `POWER_BI_TENANT_ID`

It must be set to the **tenant id** of an **Azure app registration** that has a "_Member_" access to your PowerBI
workspace.

In the Azure portal, in the view of your app registration, you can find the tenant id in the _Overview_. This value is a
GUID, it should have a pattern similar to `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`.

#### `POWER_BI_CLIENT_ID`

It must be set to the **client id** of an **Azure app registration** that has a "_Member_" access to your PowerBI
workspace.

In the Azure portal, in the view of your app registration, you can find the client id in the _Overview_. This value is a
GUID, it should have a pattern similar to `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`.

#### `POWER_BI_CLIENT_SECRET`

Its value must be a client secret, generated by an **Azure app registration** that has a "_Member_" access to your
PowerBI workspace.

From the Azure portal, you can generate client secrets from
_Azure Portal_ > _App Registrations_ > _[name of your webapp app registration]_ > _Certificates & secrets_.

#### `AZURE_COSMO_API_APPLICATION_ID`

_Required if your webapp uses Azure for user authentication_

This parameter is necessary to **validate the audience** of the access tokens received by the Azure Function: queries
whose bearer token doesn't match this audience will be rejected.

The expected value is the **application id** of the **Cosmo Tech API enterprise application**. You can find this value
in the Azure portal, in the "_Overview_" blade of the Cosmo Tech API application that your webapp instance uses). This
value is a GUID, it should have a pattern similar to `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`.

#### `KEYCLOAK_REALM`

_Required if your webapp uses Keycloak for user authentication_

This parameter is necessary to validate the access tokens received by the Azure Function.

The expected value is the **URL of the Keycloak realm** used in your webapp to authenticate users.

### Azure Function configuration in the Azure portal

The goal of this function is to enable a "**service account**" in the webapp for users to access embedded PowerBI
dashboards. It requires to have an existing Azure app registration, whose credentials (client id and client secret) will
be used to retrieve an access token. **This app registration must be added as a "_Member_" of your PowerBI workspace**.

For security reasons, it is recommended to create a different app registration for this service account, and not to
reuse the existing app registration associated to your Azure Static Web App.

The configuration of the [`GetEmbedInfo`](apiAzureFunctions.md) Azure Function can be done from your Static Web App
instance. Open the "_Configuration_" blade
(_Azure Portal_ > _Static Web Apps_ > _[name of your webapp]_ > _Configuration_), and add the environment variables
below:

| Parameter name                   | Value description                                                  |
| -------------------------------- | ------------------------------------------------------------------ |
| `POWER_BI_TENANT_ID`             | tenant id of your service account app registration                 |
| `POWER_BI_CLIENT_ID`             | client id of your service account app registration                 |
| `POWER_BI_CLIENT_SECRET`         | a client secret generated in your service account app registration |
| `AZURE_COSMO_API_APPLICATION_ID` | application id of the Cosmo Tech platform enterprise application   |

### Azure Function configuration for local run

If you want to run the Azure Function locally to visualize the embedded dashboards from a local webapp, you first need
to install [Azure Functions Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local).

The local Azure Function configuration requires the same parameters as described in the previous section, stored in a
JSON file. Create a _**local.settings.json**_ file in the **api** folder with the following content:

```json
{
  "IsEncrypted": false,
  "Values": {
    "POWER_BI_TENANT_ID": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "POWER_BI_CLIENT_ID": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "POWER_BI_CLIENT_SECRET": "<insert generated client secret here>",
    "AZURE_COSMO_API_APPLICATION_ID": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  }
}
```

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

This webapp comes with light and dark themes. Having a unique theme for Power BI, either a dark or a light one, would
clash when the other one is used for the webapp theme. When `additionalData.webapp.chartsuseWebappTheme` is enabled in
the workspace configuration, the embedded dashboards will apply a custom theme based on the selected light or dark mode
in the webapp.

The files `darkTheme.json` and `lightTheme.json` are provided, which offer the bare minimum color palettes. These files
can then be customized, to achieve specific goals, according to one's reports charts look and feel.

_Note: since **v7.0.0**, the webapp no longer applies its custom PowerBI themes by default._

### How to customize your own themes

If you want to customize the provided light and dark themes, simply modify the `src/theme/powerBI/(dark|light)Theme.json` files, according to your needs.

The Microsoft documentation on how to create report themes explains the overall syntax and general principles: [Use report themes in Power BI Desktop](https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-report-themes).

To go further, the following GitHub has a lot of showcases, which teaches what can be customized in extensive details: [pro-power-bi-theme-creation](https://github.com/Apress/pro-power-bi-theme-creation/blob/main/FullTheme.json).
