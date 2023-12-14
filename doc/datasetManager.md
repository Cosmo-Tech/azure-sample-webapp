# Dataset manager view

## Goal

The dataset manager view is an optional view of the webapp, where datasets can be
**browsed, created, edited, visualized and deleted**. The main feature of this view is to enable the end-users of the
webapp to **create their own datasets** that can then be used in new scenarios.

The datasets resources are **stored at the organization level**: users will thus see the same list of datasets when
switching between different workspaces. Yet the **datasets overview** can be customized to display different indicators
based on the currently selected workspace.
**Integrators must configure the indicators to show in the workspace description.**

Please note that since v3.0 of Cosmo Tech API, datasets are subject to _Role-Based Access Control_, meaning that
datasets created by someone won't necessarily be visible by the other users. Also, if your project contains legacy
datasets created prior to API v3.0, you may want to check and update their field `security` (using the Cosmo Tech API)
to prevent accidental changes or removal by the webapp users.

## Dataset manager configuration

The configuration of the dataset manager must be defined in the **workspace description**. This description is usually
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

When datasets are created in the dataset manager, the Cosmo Tech API will automatically import their data in a
_twin graph_ resource, stored in a RedisGraph database. These data can then be queried with the
[Cypher query language](https://neo4j.com/docs/getting-started/cypher-intro/). In order to display indicators in the
dataset manager, **you have to provide the list of cypher queries to use**.

Configuration for these queries must be defined with the key [workspace].webApp.options.datasetManager.queries.
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
            { id: 'nodes', name: { en: 'Nodes', fr: 'Noeuds' }, query: 'nodes_query' },
            { id: 'relationships', name: { en: 'Relationships', fr: 'Relations' }, query: 'relationships_query' },
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
              kpis: [
                { id: 'stock_quantity', name: { en: 'Quantity', fr: 'Quantité' } },
                { id: 'stock_initial_sum', name: { en: 'Initial sum', fr: 'Stock initial' } },
                { id: 'stock_purchasing_cost', name: { en: 'Purchasing cost', fr: "Coût d'achat" } },
                { id: 'stock_resource_quantity', name: { en: 'Resource quantity', fr: 'Ressources' } },
              ],
              attributes: ['Label', 'TransportUnit', 'Duration'],
            },
            {
              id: 'demands',
              name: { en: 'Demands', fr: 'Demandes' },
              type: 'entity',
              kpis: [
                { name: { en: 'My KPI #1 that has no id and will thus never be shown', fr: 'Mon KPI n°1' } },
                { id: 'demands_kpi2', name: { en: 'My KPI #2', fr: 'Mon KPI n°2' } },
                { id: 'demands_kpi3', name: { en: 'My KPI #3', fr: 'Mon KPI n°3' } },
                { id: 'demands_kpi4', name: { en: 'My KPI #4', fr: 'Mon KPI n°4' } },
              ],
            },
          ],
        },
      },
    },
  },
];
```

This config will then be used when **running your webapp locally**, to let you iterate quickly and tests different
configurations of the dataset manager. You can even commit these changes in your webapp repository to
keep using this "configuration patch" in **deployed webapps** (it can be useful for feature preview environments).
