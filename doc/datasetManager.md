# Dataset manager view

## Goal

The dataset manager view is an optional view of the webapp, where datasets can be
**browsed, created, edited, visualized and deleted**. The main feature of this view is to enable the end-users of the
webapp to **create their own datasets** that can then be used in new scenarios.

The dataset resources are **stored at the organization level**: users will thus see the same list of datasets when
switching between different workspaces. Yet the **datasets overview** can be customized to display different indicators
based on the currently selected workspace.
**Integrators must configure the indicators to show in the workspace description.**

Please note that since v3.0 of Cosmo Tech API, datasets are subject to _Role-Based Access Control_, meaning that
datasets created by someone won't necessarily be visible by the other users. Also, if your project contains legacy
datasets created prior to API v3.0, you may want to check and update their field `security` (using the Cosmo Tech API)
to prevent accidental changes or removal by the webapp users.

> **Warning**
>
> The webapp users **must have at least the role `user` in the Organization** resource to be able to create datasets

Several parts of this view can be customized via configuration to fit your project needs:

- the indicators and categories displayed in the "**_overview_**" can be configured from the workspace description
- you can declare run templates to run your own custom ETL scripts and create datasets from external sources (e.g. Azure Storage, ADT, user file upload); the run templates must be added in your simulator image, and their parameters can be configured in the solution description
- similarly, you can also declare run templates to create subdatasets of existing an existing dataset (e.g. by applying filters that end-users can configure)

## Overview configuration

In the dataset manager view, the main panel displays an overview of the currently selected dataset. By default, its content will be empty, you have to define what to show inside in the **workspace description**. This description is usually
defined in a file (e.g. _Workspace.yaml_) and this file is used to create a workspace (or patch an existing one) with
the Cosmo Tech API (via Swagger or restish for example).

The configuration contains three parts:

- a list of **database queries** that will be run to compute indicators, in order to provide end-users with insights on
  the existing datasets
- the **graph indicators** represent macro indicators of the dataset content, displayed as small cards in the dataset
  overview
- the **categories**, displayed below the graph indicators, are used to provide more detailed insights for the different
  types of elements inside the dataset

### Queries

When datasets are created in the dataset manager (e.g. with the Cosmo Tech API), most import scripts will write their
data in a _twin graph_ resource, stored in a RedisGraph database. These data can then be queried with the
[Cypher query language](https://neo4j.com/docs/getting-started/cypher-intro/). In order to display indicators in the
dataset manager, **you have to provide the list of cypher queries to use**.

Configuration for these queries must be defined with the key `[workspace].webApp.options.datasetManager.queries`.
The value for this field must be an **array of objects**, where each object represents one query, with the
following fields:

- `id`: a unique identifier string for this query
- `query`: the string value of the cypher query to send

Each query can compute one or several indicators: each indicator must be a part of the `RETURN` statement, with the
keyword `AS` followed by the identifier of the indicator.
The examples below provide generic samples of configuration that you can use to display the
**number of nodes and relationships** in your dataset.

<details>
<summary>JSON example</summary>

```json
{
  "webApp": {
    "options": {
      "datasetManager": {
        "queries": [
          { "id": "nodes_query", "query": "OPTIONAL MATCH (n) RETURN count(n) AS nodes" },
          { "id": "relationships_query", "query": "OPTIONAL MATCH ()-[r]->() RETURN COUNT(r) AS relationships" }
        ]
      }
    }
  }
}
```

</details>

<details>
<summary>YAML example</summary>

```yaml
webApp:
  options:
    datasetManager:
      queries:
        - id: nodes_query
          query: OPTIONAL MATCH (n) RETURN count(n) AS nodes
        - id: relationships_query
          query: 'OPTIONAL MATCH ()-[r]->() RETURN COUNT(r) AS relationships'
```

</details>

#### Tips & queries examples

- it is recommended to use `OPTIONAL MATCH` instead of `MATCH` in your queries, to have default values of "0" for your indicators when the query does not match anything in a dataset
- you can filter on a specific type of node or relationship:
  - `OPTIONAL MATCH (b:Bar) RETURN COUNT(b) AS bars_count`
  - `OPTIONAL MATCH ()-[r:arc_Satisfaction]->() RETURN COUNT(r) AS customer_to_customer_links`
  - `OPTIONAL MATCH ()-[r {name: "contains_Customer"}]->() RETURN COUNT(r) AS bar_to_customer_links`
- a single request can be used to return several indicators:
  ```
  OPTIONAL MATCH (b:Bar) RETURN
    COUNT(b) AS bars_count,
    AVG(b.Stock) AS average_stock,
    MIN(b.NbWaiters) AS min_waiters,
    MAX(b.NbWaiters) AS max_waiters,
    AVG(b.NbWaiters) AS average_waiters
  ```

### Graph indicators

Configuration for the graph indicators must be defined with the key
`[workspace].webApp.options.datasetManager.graphIndicators`.
The value for this field must be an **array of objects**, where each object represents one indicator, with the
following fields:

- `id`: a unique identifier string for this indicator
- `name`: an object with translations of the indicator name
- `queryId`: the identifier of the _query_ whose results contain the indicator (see section Queries above)

<details>
<summary>JSON example</summary>

```json
{
  "webApp": {
    "options": {
      "datasetManager": {
        "graphIndicators": [
          {
            "id": "nodes",
            "name": { "en": "Nodes", "fr": "Noeuds" },
            "queryId": "nodes_query"
          },
          {
            "id": "relationships",
            "name": { "en": "Relationships", "fr": "Relations" },
            "queryId": "relationships_query"
          }
        ]
      }
    }
  }
}
```

</details>

<details>
<summary>YAML example</summary>

```yaml
webApp:
  options:
    datasetManager:
      graphIndicators:
        - id: nodes
          name:
            en: Nodes
            fr: Noeuds
          queryId: nodes_query
        - id: relationships
          name:
            en: Relationships
            fr: Relations
          queryId: relationships_query
```

</details>

### Categories

Configuration for the categories must be defined with the key
`[workspace].webApp.options.datasetManager.categories`.
The value for this field must be an **array of objects**, where each object represents one category, with the
following fields:

- `id`: a unique identifier string for this category
- `name`: an object with translations of the category name
- `type` _(optional)_: a string with one of the values `"entity"` or `"relationship"` (leave to `null` to hide this
  information)
- `description` _(optional)_: an object with translations of the category description
- `kpis` _(optional)_: an array of objects to represent key indicators of the category; each KPI object is defined with
  the fields:
  - `id`: a unique identifier string for this indicator
  - `name`: an object with translations of the indicator name
  - `queryId`: the identifier of the _query_ whose results contain the indicator (see section Queries above)
- `attributes` _(optional)_: an array of string values, to display the attributes of the category

<details>
<summary>JSON example</summary>

```json
{
  "webApp": {
    "options": {
      "datasetManager": {
        "categories": [
          {
            "id": "stock",
            "name": { "en": "Stock", "fr": "Stock" },
            "type": "relationship",
            "description": {
              "en": "A stock is a supply chain model entity representing location of part between operations.\nA stock contains one and only one part reference",
              "fr": "Le stock est l'entité du modèle Supply Chain représentant les biens entre les opérations."
            },
            "kpis": [
              { "id": "stock_quantity", "name": { "en": "Quantity", "fr": "Quantité" } },
              { "id": "stock_initial_sum", "name": { "en": "Initial sum", "fr": "Stock initial" } },
              { "id": "stock_purchasing_cost", "name": { "en": "Purchasing cost", "fr": "Coût d'achat" } },
              { "id": "stock_resource_quantity", "name": { "en": "Resource quantity", "fr": "Ressources" } }
            ],
            "attributes": ["Label", "TransportUnit", "Duration"]
          }
        ]
      }
    }
  }
}
```

</details>

<details>
<summary>YAML example</summary>

```yaml
webApp:
  options:
    datasetManager:
      categories:
        - id: stock
          name:
            en: Stock
            fr: Stock
          type: relationship
          description:
            en: >-
              A stock is a supply chain model entity representing location of
              part between operations.

              A stock contains one and only one part reference
            fr: >-
              Le stock est l'entité du modèle Supply Chain représentant les
              biens entre les opérations.
          kpis:
            - id: stock_quantity
              name:
                en: Quantity
                fr: Quantité
            - id: stock_initial_sum
              name:
                en: Initial sum
                fr: Stock initial
            - id: stock_purchasing_cost
              name:
                en: Purchasing cost
                fr: Coût d'achat
            - id: stock_resource_quantity
              name:
                en: Resource quantity
                fr: Ressources
          attributes:
            - Label
            - TransportUnit
            - Duration
```

</details>

## Dataset creation scripts

### Default transformation scripts

In order to let users create their own dataset, the webapp provides, by default, four transformation mechanisms to
create twingraph datasets. They will be identified with these keys:

- `ADT`: load data from Azure Digital Twin to a new twingraph dataset
- `AzureStorage`: load data from Azure Storage to a new twingraph dataset
- `File`: load data from a local file uploaded by a webapp user, to a new twingraph dataset
- `None`: creates an empty twingraph dataset, that can later be filled by using cypher queries

Most of these data sources have parameters, whose values must be declared by webapp users in order to create new
datasets. Their parameters are:

- `ADT`:
  - `location`: URL of the Azure Digital Twin instance
- `AzureStorage`:
  - `name`: Name of the storage account in Azure storage
  - `location`: Name of the blob container in Azure storage
  - `path`: Path to the dataset folder in Azure storage

Note that you can specify **custom tooltips and default values** for these data sources: they will be displayed in the
dataset creation wizard to help users fill the data source parameters. These tooltips and values can be configured
in your workspace description, in the option `[workspace].webApp.options.datasetManager.datasourceParameterHelpers`.

The value of `datasourceParameterHelpers` must be an **array of objects**, where each object represents a datasource.
Each datasource must have two keys: `id` (containing one of the data source identifiers listed above), and a
`parameters` property containing a list of objects. Each object represents a parameter: it must have an `id` property,
and can have the properties `defaultValue` (string) and `tooltipText` (dictionary of translation, with language codes as
keys, and labels as values).

<details>
<summary>JSON example</summary>

```json
{
  "webApp": {
    "options": {
      "datasetManager": {
        "datasourceParameterHelpers": [
          {
            "id": "AzureStorage",
            "parameters": [
              {
                "id": "name",
                "defaultValue": "my_csm_platform",
                "tooltipText": {
                  "en": "Name of the storage account in Azure storage",
                  "fr": "Nom du compte de stockage dans Azure storage"
                }
              },
              {
                "id": "location",
                "defaultValue": "o-orgnztn0123",
                "tooltipText": {
                  "en": "Name of the blob container in Azure storage (usually the organization id in lowercase)",
                  "fr": "Nom du conteneur d’objets blobs dans Azure storage (en général, l'id de l'organisation en minuscules)"
                }
              },
              {
                "id": "path",
                "defaultValue": "w-wrkspce0123/brewery_instance_amsterdam",
                "tooltipText": {
                  "en": "Path to dataset files in Azure storage (e.g. w-wrkspce0123/brewery_instance_amsterdam)",
                  "fr": "Chemin des fichiers du dataset dans Azure storage (ex: w-wrkspce0123/brewery_instance_amsterdam)"
                }
              }
            ]
          },
          {
            "id": "ADT",
            "parameters": [
              {
                "id": "location",
                "defaultValue": "https://o-orgnztn0123-mybrewery.api.weu.digitaltwins.azure.net",
                "tooltipText": {
                  "en": "URL of your Azure Digital Twin instance",
                  "fr": "URL de l'instance Azure Digital Twin"
                }
              }
            ]
          }
        ]
      }
    }
  }
}
```

</details>

<details>
<summary>YAML example</summary>

```yaml
webApp:
  options:
    datasetManager:
      datasourceParameterHelpers:
        - id: AzureStorage
          parameters:
            - id: name
              defaultValue: csmphoenixdev
              tooltipText:
                en: Name of the storage account in Azure storage
                fr: Nom du compte de stockage dans Azure storage
            - id: location
              defaultValue: o-orgnztn0123
              tooltipText:
                en: >-
                  Name of the blob container in Azure storage (usually the
                  organization id in lowercase)
                fr: >-
                  Nom du conteneur d’objets blobs dans Azure storage (en
                  général, l'id de l'organisation en minuscules)
            - id: path
              defaultValue: w-wrkspce0123/brewery_instance_amsterdam
              tooltipText:
                en: >-
                  Path to dataset files in Azure storage (e.g.
                  w-wrkspce0123/brewery_instance_amsterdam)
                fr: >-
                  Chemin des fichiers du dataset dans Azure storage (ex:
                  w-wrkspce0123/brewery_instance_amsterdam)
        - id: ADT
          parameters:
            - id: location
              defaultValue: 'https://o-orgnztn0123-mybrewery.api.weu.digitaltwins.azure.net'
              tooltipText:
                en: URL of your Azure Digital Twin instance
                fr: URL de l'instance Azure Digital Twin
```

</details>

### Custom ETLs

In addition to these four options, **you can develop your own ETL scripts** and make them available from the dataset
manager. These ETLs are actually defined as **run templates** (similar to those used to run scenarios), that will be
identified with a specific tag: `datasource`. Just like the run templates used for scenarios, **each ETL can have
parameters** (defined in `parameterGroups`), but the list of the currently supported `varType`s is shorter:

- `string`
- `enum`
- `list`
- `%DATASETID%`

For these types, the configuration of parameters is mostly identical to the configuration of scenario parameters
(see [Scenario Parameters configuration](scenarioParametersConfiguration.md)).

All run templates defined with the tag `datasource` will be selectable as source type for dataset creation (in dataset
manager view), and will be hidden in the scenario creation dialog (in scenario view).

:information_source: Useful tips to write your ETL run templates:

- when users confirm the dataset creation, **the webapp automatically creates a new dataset object**, associates it to a
  new runner instance, and refreshes the dataset to trigger the start of the runner
- the id of this new dataset is provided to the runner, as the **first element of** `datasetList`
- at the end of your ETL, when the dataset is ready, change the dataset `ingestionStatus` to `SUCCESS`
- if your ETL fails, change the dataset `ingestionStatus` to `ERROR`

### Configuration examples

<details>
<summary>Solution.json example</summary>

```json
{
  "runTemplates": [
    {
      "id": "etl_with_azure_storage",
      "name": "Azure Storage ETL (<fallback name when translatable labels are not defined>)",
      "labels": {
        "fr": "Brewery (.csv) depuis Azure Storage (<label translation>)",
        "en": "Brewery (.csv) from Azure Storage"
      },
      "parameterGroups": ["etl_param_group_bar_parameters", "etl_param_group_azure_storage"],
      "tags": ["datasource"]
    }
  ]
}
```

</details>

<details>
<summary>Solution.yaml example</summary>

```yaml
runTemplates:
  - id: etl_with_azure_storage
    name: >-
      Azure Storage ETL (<fallback name when translatable labels are not
      defined>)
    labels:
      fr: Brewery (.csv) depuis Azure Storage (<label translation>)
      en: Brewery (.csv) from Azure Storage
    parameterGroups:
      - etl_param_group_bar_parameters
      - etl_param_group_azure_storage
    tags:
      - datasource
```

</details>

## Subdataset creation scripts

The dataset creation scripts described in the previous section are useful to create datasets from external data sources.
Yet in some cases, you may want to create new datasets simply by filtering an existing dataset, already accessible from
the webapp. _Sub-datasources_ are a specific type of data sources that aim to do exactly this: run a custom ETL script
to **create a subdataset** from an existing dataset. Declaring this type of run template is straightforward: you just
have to delclare them with the tag `subdatasource`.

From the webapp interface, the button to create subdatasets will only be available when a dataset is selected: this
dataset will be the **_parent dataset_**.

The parameters constraints and configuration are the same as for the dataset creation scripts. The only difference is
that for subdatasources, **the property `datasetList` of the runner contains two elements**:

- the first one is still the id of the dataset created by the webapp (do not forget to update its status in your ETL)
- the second element of the list indicates **the id of the parent dataset**

## Data source filters

In some cases, you may want to hide some of the default transformation scripts, or to show different ETLs in different
workspaces. The following option can be defined in your workspace description to do this:
`[workspace].webApp.options.datasetManager.datasourceFilter`.
By providing a **list of run template ids**, you can select the entries that will be shown to webapp user. When this
option is left undefined, all default transformations and all run templates with the tag `datasource` are shown in
the dataset creation wizard.

Note that you can use this filter to show or hide the default transformation scripts, by using their id: `ADT`,
`AzureStorage`, `File` and `None`.

The **same filter exists for subdataset creation ETLs**: `[workspace].webApp.options.datasetManager.subdatasourceFilter`.
When this option is left undefined, all run templates with the tag `subdatasource` are shown when creating subdatasets.

<details>
<summary>JSON example</summary>

```json
{
  "webApp": {
    "options": {
      "datasetManager": {
        "datasourceFilter": ["AzureStorage", "File", "my_dataset_etl"],
        "subdatasourceFilter": ["my_subdataset_etl"]
      }
    }
  }
}
```

</details>

<details>
<summary>YAML example</summary>

```yaml
webApp:
  options:
    datasetManager:
      datasourceFilter:
        - AzureStorage
        - File
        - my_dataset_etl
      subdatasourceFilter:
        - my_subdataset_etl
```

</details>

## Troubleshooting

### Overriding the workspace configuration

Updating the workspace configuration via the Cosmo Tech API (with restish or swagger) can be a slow, cumbersome and
error-prone process. A simpler way to iterate on the dataset manager configuration during development is to use the file
[src/config/overrides/Workspaces.js](../src/config/overrides/Workspaces.js). This file can be used to override the
configuration of any workspace, by patching the workspace data sent by the Cosmo Tech API.

Open the file and modify the `WORKSPACES` constant, that contains an array of workspace objects. These objects must
contain an `id` property, that will be used to patch the matching workspace sent by the API.

Here is an example of how to override the `datasetManager` configuration via the
[src/config/overrides/Workspaces.js](../src/config/overrides/Workspaces.js) file:

```js
export const WORKSPACES = [
  {
    id: 'w-000000000', // replace this id by your workspace id
    webApp: {
      options: {
        datasetManager: {
          graphIndicators: [
            { id: 'nodes', name: { en: 'Nodes', fr: 'Noeuds' }, queryId: 'nodes_query' },
            { id: 'relationships', name: { en: 'Relationships', fr: 'Relations' }, queryId: 'relationships_query' },
          ],
          categories: [
            {
              id: 'stock',
              name: { en: 'Stock', fr: 'Stock' },
              type: 'relationship',
              description: {
                en:
                  'A stock is a supply chain model entity representing location of part between operations.\n' +
                  'A stock contains one and only one part reference',
                fr: "Le stock est l'entité du modèle Supply Chain représentant les biens entre les opérations.",
              },
              kpis: [{ id: 'stock_average', name: { en: 'Quantity', fr: 'Quantité' }, queryId: 'stock_query' }],
              attributes: ['Label', 'TransportUnit', 'Duration'],
            },
          ],
          queries: [
            { id: 'nodes_query', query: 'OPTIONAL MATCH (n) RETURN COUNT(n) AS nodes' },
            { id: 'relationships_query', query: 'OPTIONAL MATCH ()-[r]->() RETURN COUNT(r) AS relationships' },
            { id: 'stock_query', query: 'OPTIONAL MATCH (n:MyNodeType) RETURN AVG(n.Stock) AS stock_average' },
          ],
        },
      },
    },
  },
];
```

This config will then be used when **running your webapp locally**, to let you iterate quickly and test different
configurations of the dataset manager. You can even commit these changes in your webapp repository to
keep using this "configuration patch" in **deployed webapps** (it can be useful for "feature preview" environments).
