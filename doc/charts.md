# Charts (scenario results)

## Introduction

The azure-sample-webapp provides users with embedded dashboards in the _Scenario_ and _Dashboards_ views to
**display the results of scenario runs**:

- in the _Scenario_ page, these reports usually display the results of the currently selected scenario, after it has
  run; you can either define a specific report to use for each run template, or display a generic report for all run
  templates
- the _Dashboards_ page offers a menu to let users switch between several reports; this view can typically be used for
  in-depth results analysis or to compare the results of several scenarios

For both pages, these reports must be configured **for each workspace**, directly in the _Workspace_ data declared to
the Cosmo Tech API. For troubleshooting purposes, you can also "patch" the
configuration of an existing workspace by applying changes defined in your front-end configuration folder (see section
[Overriding the workspace configuration](#overriding-the-workspace-configuration)).

Two BI tools are currently supported: **PowerBI** and **Superset**. Only one of them can be used in a given workspace,
but with multiple workspaces, it is possible to switch between these two options inside a single webapp.

The configuration for these two options use common concepts, that will be explained in the sections below, but the
syntax and structure can slightly differ (see the dedicated pages [PowerBI configuration](charts_powerBI.md) and
[Superset configuration](charts_superset.md) for more details).

## Back-end overview

PowerBI and Superset services both require access tokens to communicate between the webapp and the BI server. Retrieving
a token for these services usually relies on a "secret" value, that cannot be stored in the webapp source code. Because
of this, when charts are enabled in a workspace, the webapp **must be deployed with a Function App**, a stateless
server whose only role will be to fetch access tokens for the webapp users.

_Note: for PowerBI charts, the webapp also supports using the identity of the connected user; in this case, the
Function App is not necessary_

## Workspace configuration

In your Workspace object data, the reports can be configured as an object in `additionalData.webapp.charts`. This
`charts` object usually contains:

- **common options** for all embedded reports
- the list of reports to display in the **scenario view**
- the list of reports to display in the **dashboard view**

If you want to completely disable the display of simulation results, then you can leave `additionalData.webapp.charts`
undefined in your workspace configuration. When charts are disabled, **the dashboard page is hidden**, and the results
are replaced by a **placeholder with the scenario status** in the scenario view.

## Report configuration

Whether you are using PowerBI or Superset, the report configuration share common concepts: **filters** and
**context-dependent configuration** (differences between the Scenario view and the Dashboard view).

### Filters

The first type of filter is **static filters**. They let you filter a given table column on a hard-coded value.

The second type is **dynamic filters**. They can be configured to let the webapp automatically sends filter values
**based on the metadata of the selected scenario**. This mechanism allows for more relevant and context-dependent
reports, adapting the scope of the results shown to various information: the currently selected scenario, its parent or
root scenarios, or even the scenarios available to the user in the webapp.

For example, you can filter the rows of several tables to only display the results of the last simulation run, by
using the `lastRunId` dynamic filter.

Here is the list of dynamic filters available:

| Filter name                  | Description                                                    |
| ---------------------------- | -------------------------------------------------------------- |
| `id`                         | _id_ of the current scenario                                   |
| `name`                       | _name_ of the current scenario                                 |
| `lastRunId`                  | _id of the last run_ of the current scenario                   |
| `lastRunStatus`              | _status of the last run_ of the current scenario               |
| `rootId`                     | _id_ of the root scenario of the current scenario              |
| `parentId`                   | _id_ of the parent scenario of the current scenario            |
| `ownerId`                    | _id_ of the user that created the current scenario             |
| `solutionId`                 | _id_ of the solution                                           |
| `visibleScenariosIds`        | list of _ids_ of the scenarios visible to the user             |
| `visibleScenariosLastRunIds` | list of _ids_ of the last run of scenarios visible to the user |

_Note: Since v7.0.0, the options `csmSimulationRun` and `visibleScenariosCsmSimulationRunsIds` no longer exist_

### Scenario view vs. Dashboard view

In the _Dashboard_ view, the webapp shows a menu on the left side to let users switch between different reports. When they
are used **in the Dashboard view, the reports must thus contain a title**. You can configure multiple labels for
translations, and the webapp will pick the label matching the selected language.

In the _Scenario_ view, you can use a **single report for all run templates**, or you can
**map some reports to some specific run templates**. The second option might be necessary when you have run templates
with different data structures for the simulation results.

## Troubleshooting

### Azure Function configuration for local run

If you want to run the Azure Function locally to visualize the embedded dashboards from a local webapp, you first need
to install [Azure Functions Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local).

The exact parameters to include in the configuration of the Azure Function depends on the desired BI tools, but they
will always be stored in a JSON file named _**local.settings.json**_.

```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "COSMOTECH_API_URL": "https://my-api.cosmotech.com/my-tenant/v5",
    "SUPERSET_API_URL": "https://my-superset.cosmotech.com/api/v1",
    "KEYCLOAK_REALM_URL": "https://my-keycloak.cosmotech.com/keycloak/realms/my-tenant",
    "SUPERSET_SUPERUSER_USERNAME": "<admin_username>",
    "SUPERSET_SUPERUSER_PASSWORD": "<admin_password>",
    "POWER_BI_TENANT_ID": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "POWER_BI_CLIENT_ID": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "POWER_BI_CLIENT_SECRET": "<client_secret>"
  },
  "Host": {
    "CORS": "*"
  }
}
```

For more details on these parameters, see the dedicated pages [PowerBI configuration](charts_powerBI.md) and
[Superset configuration](charts_superset.md).

### Overriding the workspace configuration

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
    additionalData: {
      webapp: {
        charts: {
          // ...
        },
      },
    },
  },
];
```

This configuration will then be used when **running your webapp locally**, to quickly iterate on the configuration to
check your dashboards configuration. You can even commit these changes in your webapp repository to keep using this
"configuration patch" in **deployed webapps** (it can be useful for feature preview environments).
