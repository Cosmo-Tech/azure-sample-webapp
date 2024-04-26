// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const defaultScenarioViewReport = {
  title: { en: 'Scenario dashboard', fr: 'Rapport du scénario' },
  reportId: '608b7bef-f5e3-4aae-b8db-19bbb38325d5',
  settings: { navContentPaneEnabled: false, panes: { filters: { expanded: true, visible: true } } },
  staticFilters: [{ table: 'Bar', column: 'Bar', values: ['MyBar', 'MyBar2'] }],
  dynamicFilters: [
    { table: 'StockProbe', column: 'SimulationRun', values: 'csmSimulationRun' },
    { table: 'Bar', column: 'simulationrun', values: 'csmSimulationRun' },
    { table: 'contains_Customer', column: 'simulationrun', values: 'csmSimulationRun' },
    { table: 'arc_to_Customer', column: 'simulationrun', values: 'csmSimulationRun' },
    { table: 'parameters', column: 'simulationrun', values: 'csmSimulationRun' },
    { table: 'CustomerSatisfactionProbe', column: 'SimulationRun', values: 'csmSimulationRun' },
  ],
  pageName: { en: 'ReportSection', fr: 'ReportSection' },
};

// Use the WORKSPACES array below to override or add information to your workspaces. This can be useful for development
// purposes, but it is recommended to leave this array empty and use the API to update your Workspace instead for
// production environments.
export const WORKSPACES = [
  {
    id: 'w-70klgqeroooz',
    webApp: {
      options: {
        charts: {
          workspaceId: '290de699-9026-42c0-8c83-e4e87c3f22dd',
          logInWithUserCredentials: false,
          scenarioViewIframeDisplayRatio: 1580 / 350,
          dashboardsViewIframeDisplayRatio: 1280 / 795,
          dashboardsView: [
            {
              title: { en: 'Digital Twin Structure', fr: 'Structure du jumeau numérique' },
              reportId: '608b7bef-f5e3-4aae-b8db-19bbb38325d5',
              settings: { navContentPaneEnabled: false, panes: { filters: { expanded: false, visible: false } } },
              pageName: { en: 'ReportSectionf3ef30b8ad34c9c2e8c4', fr: 'ReportSectionf3ef30b8ad34c9c2e8c4' },
            },
            {
              title: { en: 'Stocks Follow-up', fr: 'Suivi de stock' },
              reportId: '608b7bef-f5e3-4aae-b8db-19bbb38325d5',
              settings: { navContentPaneEnabled: false, panes: { filters: { expanded: true, visible: true } } },
              dynamicFilters: [
                { table: 'StockProbe', column: 'SimulationRun', values: 'csmSimulationRun' },
                { table: 'Bar', column: 'simulationrun', values: 'csmSimulationRun' },
                { table: 'contains_Customer', column: 'simulationrun', values: 'csmSimulationRun' },
                { table: 'arc_to_Customer', column: 'simulationrun', values: 'csmSimulationRun' },
                { table: 'parameters', column: 'simulationrun', values: 'csmSimulationRun' },
                { table: 'CustomerSatisfactionProbe', column: 'SimulationRun', values: 'csmSimulationRun' },
              ],
              pageName: { en: 'ReportSectionca125957a3f5ea936a30', fr: 'ReportSectionca125957a3f5ea936a30' },
            },
            {
              title: { en: 'Customer Satisfaction', fr: 'Satisfaction client' },
              reportId: '608b7bef-f5e3-4aae-b8db-19bbb38325d5',
              settings: { navContentPaneEnabled: true, panes: { filters: { expanded: false, visible: true } } },
              dynamicFilters: [
                { table: 'StockProbe', column: 'SimulationRun', values: 'csmSimulationRun' },
                { table: 'Bar', column: 'simulationrun', values: 'csmSimulationRun' },
                { table: 'contains_Customer', column: 'simulationrun', values: 'csmSimulationRun' },
                { table: 'arc_to_Customer', column: 'simulationrun', values: 'csmSimulationRun' },
                { table: 'parameters', column: 'simulationrun', values: 'csmSimulationRun' },
                { table: 'CustomerSatisfactionProbe', column: 'SimulationRun', values: 'csmSimulationRun' },
              ],
              pageName: { en: 'ReportSectiond5265d03b73060af4244', fr: 'ReportSectiond5265d03b73060af4244' },
            },
            {
              title: { en: 'Scenario comparison', fr: 'Comparaison de scénarios' },
              reportId: '608b7bef-f5e3-4aae-b8db-19bbb38325d5',
              settings: { navContentPaneEnabled: false, panes: { filters: { expanded: false, visible: true } } },
              dynamicFilters: [
                { table: 'StockProbe', column: 'SimulationRun', values: 'visibleScenariosCsmSimulationRunsIds' },
              ],
              pageName: { en: 'ReportSection99fca3e46d5107c9ddea', fr: 'ReportSection99fca3e46d5107c9ddea' },
            },
          ],
          scenarioView: {
            1: {
              title: { en: 'Scenario dashboard for run type 1', fr: 'Rapport de scénario du run type 1' },
              reportId: '608b7bef-f5e3-4aae-b8db-19bbb38325d5',
              settings: { navContentPaneEnabled: false, panes: { filters: { expanded: true, visible: true } } },
              staticFilters: [{ table: 'Bar', column: 'Bar', values: ['MyBar', 'MyBar2'] }],
              dynamicFilters: [
                { table: 'StockProbe', column: 'SimulationRun', values: 'csmSimulationRun' },
                { table: 'contains_Customer', column: 'simulationrun', values: 'csmSimulationRun' },
              ],
              pageName: { en: 'ReportSection937f9c72cc8f1062aa88', fr: 'ReportSection937f9c72cc8f1062aa88' },
            },
            2: defaultScenarioViewReport,
            3: defaultScenarioViewReport,
          },
        },
        instanceView: {
          dataSource: {
            type: 'adt',
            functionUrl: 'https://scenario-download-brewery-dev.azurewebsites.net/api/ScenarioDownload',
            functionKey: 'o5Xlur_7s5c00KQKnl0QveXVEFC9DXeBiOkwQEdZGx9xAzFuLsPB5A==',
          },
          dataContent: {
            compounds: { Bar_vertex: {} },
            edges: { arc_Satisfaction: { style: {}, selectable: false } },
            nodes: {
              Bar: {
                style: {
                  shape: 'rectangle',
                  'background-color': '#466282',
                  'background-opacity': 0.2,
                  'border-width': 0,
                },
                pannable: true,
                selectable: true,
                grabbable: false,
              },
              Customer: { style: { 'background-color': '#005A31', shape: 'ellipse' } },
            },
          },
        },
        menu: {
          supportUrl: 'https://support.cosmotech.com',
          organizationUrl: 'https://cosmotech.com',
          documentationUrl: 'https://portal.cosmotech.com/resources/platform-resources/platform-help',
        },
        datasetManager: {
          datasourceParameterHelpers: [
            {
              id: 'AzureStorage',
              parameters: [
                {
                  id: 'name',
                  defaultValue: 'csmphoenixdev',
                  tooltipText: {
                    en: 'Name of the storage account in Azure storage',
                    fr: 'Nom du compte de stockage dans Azure storage',
                  },
                },
                {
                  id: 'location',
                  defaultValue: 'o-gzypnd27g7',
                  tooltipText: {
                    en: 'Name of the blob container in Azure storage (usually the organization id in lowercase)',
                    fr:
                      "Nom du conteneur d’objets blobs dans Azure storage (en général, l'id de l'organisation " +
                      'en minuscules)',
                  },
                },
                {
                  id: 'path',
                  defaultValue: 'w-70klgqeroooz/brewery_instance_amsterdam',
                  tooltipText: {
                    en: 'Path to dataset files in Azure storage (e.g. w-70klgqeroooz/brewery_instance_amsterdam)',
                    fr:
                      'Chemin des fichiers du dataset dans Azure storage ' +
                      '(ex: w-70klgqeroooz/brewery_instance_amsterdam)',
                  },
                },
              ],
            },
            {
              id: 'ADT',
              parameters: [
                {
                  id: 'location',
                  defaultValue: 'https://o-gzypnd27g7-demobrewery.api.weu.digitaltwins.azure.net',
                  tooltipText: {
                    en: 'URL of your Azure Digital Twin instance',
                    fr: "URL de l'instance Azure Digital Twin",
                  },
                },
              ],
            },
          ],
          datasourceFilter: undefined, // Filter example: ['etl_with_azure_storage', 'etl_with_local_file']
          subdatasourceFilter: undefined, // Filter example: ['etl_sub_dataset_by_filter']
          graphIndicators: [
            { id: 'bars_count', name: { en: 'Bars', fr: 'Bars' }, queryId: 'bars' },
            { id: 'customers_count', name: { en: 'Customers', fr: 'Clients' }, queryId: 'customers' },
            {
              id: 'satisfaction_links_count',
              name: { en: 'Customers interactions', fr: 'Interactions clients' },
              queryId: 'satisfaction_graph',
            },
            {
              id: 'relationships_count',
              name: { en: 'All relationships', fr: 'Tous les liens' },
              queryId: 'relationships',
            },
          ],
          categories: [
            {
              id: 'bars',
              name: { en: 'Bars', fr: 'Bars' },
              type: 'entity',
              description: {
                en:
                  'Bars are compound entities in the Brewery model. They are responsible of the stock management and ' +
                  'the number of waiters.\n An entity of type Bar is the parent entity of Customers inside this bar.',
                fr:
                  'Les bars sont des entités composées du modèle Brewery. Ils sont responsables de la gestion du ' +
                  "stock et du nombre de serveurs.\nUne entité de type Bar est l'entité parente des entités Customer " +
                  'présentes dans ce bar.',
              },
              kpis: [
                { id: 'average_stock', name: { en: 'Average stock', fr: 'Moyenne stock' }, queryId: 'bars' },
                { id: 'average_waiters', name: { en: 'Average waiters', fr: 'Moyenne serveurs' }, queryId: 'bars' },
                { id: 'min_waiters', name: { en: 'Min. waiters', fr: 'Min. serveurs' }, queryId: 'bars' },
                { id: 'max_waiters', name: { en: 'Max. waiters', fr: 'Max. serveurs' }, queryId: 'bars' },
              ],
              attributes: ['NbWaiters', 'RestockQty', 'Stock'],
            },
            {
              id: 'customers',
              description: {
                en:
                  'Customers are basic entities in the Brewery model. They are used to simulate beverage ' +
                  'consumption inside Bar entities, with an influence graph between customers.',
                fr:
                  'Les clients sont des entités basiques du modèle Brewery. Ces entités permettent de simuler la ' +
                  'consommation de boisson pour chaque entité de type Bar liée, et implémentent un graphe permettant ' +
                  "d'influencer le comportement d'autres clients.",
              },
              name: { en: 'Customers', fr: 'Clients' },
              type: 'entity',
              kpis: [
                {
                  id: 'avg_satisfaction',
                  name: { en: 'Average satisfaction', fr: 'Satisfaction moyenne' },
                  queryId: 'customers',
                },
              ],
              attributes: ['Satisfaction', 'SurroundingSatisfaction', 'Thirsty'],
            },
          ],
          queries: [
            {
              id: 'bars',
              query:
                'OPTIONAL MATCH (b:Bar) RETURN COUNT(b) AS bars_count, AVG(b.Stock) AS average_stock, ' +
                'MIN(b.NbWaiters) AS min_waiters, MAX(b.NbWaiters) AS max_waiters, AVG(b.NbWaiters) AS average_waiters',
            },
            {
              id: 'customers',
              query:
                'OPTIONAL MATCH (c:Customer) RETURN COUNT(c) AS customers_count, AVG(c.Satisfaction) AS ' +
                'avg_satisfaction',
            },
            {
              id: 'satisfaction_graph',
              query: 'OPTIONAL MATCH (:Customer)-[r]->(:Customer) RETURN COUNT(r) AS satisfaction_links_count',
            },
            {
              id: 'relationships',
              query: 'OPTIONAL MATCH ()-[r]->() RETURN COUNT(r) AS relationships_count',
            },
          ],
        },
      },
    },
  },
];
