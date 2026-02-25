# Superset reports

_This page documents how to configure **Superset charts** to visualize simulation results in the webapp. For PowerBI, the instructions are documented [here](charts_powerBI.md)._

## Workspace configuration

### Overview

In your Workspace, the reports can be configured in `additionalData.webapp.charts`. For Superset charts, the structure for this `charts` object is the following:

```json
{
  "charts": {
    "supersetDomain": "<Superset domain>",
    "dashboards": [
      {
        "id": "<dashboard_id>",
        "height": "<height>",
        "width": "<width>",
        "hideTitle": "<true|false>",
        "hideChartControls": "<true|false>",
        "hideFilters": "<true|false>",
        "expandFilters": "<true|false>",
        "filters": [
          {
            "id": "<filter_id>",
            "operator": "<operator>",
            "column": "<column>",
            "value": "<value>"
          }
        ]
      }
    ],
    "scenarioView": {
      "default": "<default_dashboard_id>",
      "overrides": {
        "<run_template_id>": "<dashboard_id>"
      }
    },
    "dashboardView": [
      {
        "id": "<dashboard_id>",
        "title": {
          "en": "<English title>",
          "fr": "<French title>"
        }
      }
    ]
  }
}
```

### Dashboard view

The `dashboards` value must be an array with one or several dashboards inside it. Each dashboard in the array will be
displayed in the _Dashboards_ page. You can configure the following options for each dashboard:

- `id`: the unique identifier of the Superset dashboard
- `height`: the height of the dashboard iframe (e.g., `900px`)
- `width`: the width of the dashboard iframe (e.g., `100%`)
- `hideTitle`: whether to hide the dashboard title
- `hideChartControls`: whether to hide chart controls
- `hideFilters`: whether to hide filters
- `expandFilters`: whether to expand filters by default
- `filters`: an array of filters to apply to the dashboard. Each filter includes:
  - `id`: the filter identifier
  - `operator`: the operator to use (e.g., `==`, `!=`, `in`)
  - `column`: the column to filter on
  - `value`: the value to filter by (see the [Filters](charts.md#filters) section for supported options)

### Scenario view

There are two ways to configure the report in the _Scenario_ page:

- if you want to use a **single dashboard for all the run templates**, then `scenarioView.default` must be set to the dashboard ID
- if you want to display a **different dashboard for each run template**, then `scenarioView.overrides` must be a dictionary with run template ids as keys and the associated dashboard ids as values

### Example configuration

Here is an example of a Superset configuration:

```yaml
charts:
  supersetDomain: 'https://superset-kubernetes.cosmotech.com'
  dashboards:
    - id: '129d8644-8939-4bbb-b396-42c89b55b119'
      height: 900px
      width: 100%
    - id: '272c380b-8824-48fc-a274-aa2fefb1226a'
      height: 900px
      width: 100%
      hideTitle: true
      hideChartControls: false
      hideFilters: false
      expandFilters: false
      filters:
        - id: 'NATIVE_FILTER-TFlc5mI_Emoke793qamlg'
          operator: '=='
          column: 'simulation_run'
          value: 'lastRunId'
  scenarioView:
    default: '129d8644-8939-4bbb-b396-42c89b55b119'
    overrides:
      standalone: '272c380b-8824-48fc-a274-aa2fefb1226a'
  dashboardView:
    - id: '129d8644-8939-4bbb-b396-42c89b55b119'
      title:
        en: 'Brewery Operations Overview'
        fr: 'Aperçu des opérations'
    - id: '272c380b-8824-48fc-a274-aa2fefb1226a'
      title:
        en: 'Scenario Results'
        fr: 'Résultats du scénario'
```

## Service account configuration

To enable the webapp to fetch Superset tokens using a service account, you need to configure the Azure Function with the appropriate credentials. These credentials are stored in the `local.settings.json` file when running locally or in the **cluster secrets** when deployed.

### Configuration parameters

| Parameter name                | Required | Description                                                            |
| ----------------------------- | -------- | ---------------------------------------------------------------------- |
| `COSMOTECH_API_URL`           | yes      | base URL of the Cosmo Tech API                                         |
| `SUPERSET_API_URL`            | yes      | base URL of the Superset API                                           |
| `SUPERSET_SUPERUSER_USERNAME` | yes      | username of a Superset user account that can generate guest tokens     |
| `SUPERSET_SUPERUSER_PASSWORD` | yes      | password of the Superset user defined in `SUPERSET_SUPERUSER_USERNAME` |

### Azure Function configuration for local run

Here is an example of the configuration for Superset when running the `GetSupersetGuestToken` Function locally:

```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "COSMOTECH_API_URL": "https://my-api.cosmotech.com/my-tenant/v5",
    "SUPERSET_API_URL": "https://my-superset.cosmotech.com/api/v1",
    "SUPERSET_SUPERUSER_USERNAME": "<admin_username>",
    "SUPERSET_SUPERUSER_PASSWORD": "<admin_password>"
  },
  "Host": {
    "CORS": "*"
  }
}
```

These values allow the Azure Function to authenticate with Superset and retrieve the necessary tokens for embedding dashboards in the webapp. Ensure that these credentials are securely stored and not exposed in the source code.
