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
    id: 'w-81264wr3xw5q5',
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
            functionKey: 'sFGoW45A4TthGp9bunsKhzH7A8a4nR-JK82jjHQ6Ja-WAzFuFc-sOg==',
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
          graphIndicators: [
            { id: 'entities', name: { en: 'Entities', fr: 'Entités' } },
            { id: 'relationships', name: { en: 'Relationships', fr: 'Relations' } },
            { id: 'graphKpi0' },
            { id: 'graphKpi1' },
            { id: 'graphKpi2' },
            { id: 'graphKpi3' },
          ],
          categories: [
            {
              id: 'transport',
              name: { en: 'Transport', fr: 'Transport' },
              type: 'relationship',
              description: {
                en:
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor  incididunt ut ' +
                  'labore et dolore magna aliqua.',
                fr:
                  'Impedit impedit commodi laboriosam iusto voluptas itaque quisquam sint. Aut nemo reprehenderit ' +
                  'rerum reiciendis.\nEarum repellat sit quia totam eligendi consectetur. Quo totam inventore ' +
                  'possimus eveniet nobis. Dignissimos laudantium laborum et dolores itaque.',
              },
              kpis: [
                { id: 'transport_kpi1', name: { en: 'My KPI #1', fr: 'Mon KPI n°1' } },
                { id: 'transport_kpi2', name: { en: 'My KPI #2', fr: 'Mon KPI n°2' } },
              ],
              attributes: ['Name', 'Source', 'Destination'],
            },
            {
              id: 'productionOperation',
              name: { en: 'Production operation', fr: 'Opération de production' },
              type: 'relationship',
              kpis: [{ id: 'productionOperation_kpi1' }, { id: 'productionOperation_kpi2' }],
            },
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
              id: 'configuration',
              name: { en: 'Configuration', fr: 'Configuration' },
              type: 'relationship',
            },
            {
              id: 'demands',
              name: { en: 'Demands', fr: 'Demandes' },
              type: 'entity',
              kpis: [
                { id: 'demands_kpi1', name: { en: 'My KPI #1', fr: 'Mon KPI n°1' } },
                { id: 'demands_kpi2', name: { en: 'My KPI #2', fr: 'Mon KPI n°2' } },
                { id: 'demands_kpi3', name: { en: 'My KPI #3', fr: 'Mon KPI n°3' } },
                { id: 'demands_kpi4', name: { en: 'My KPI #4', fr: 'Mon KPI n°4' } },
              ],
            },
            {
              id: 'input',
              name: { en: 'Input', fr: 'Entrées' },
              type: 'entity',
              kpis: [{ id: 'input_kpi1', name: { en: 'My KPI #1', fr: 'Mon KPI n°1' } }],
            },
            {
              id: 'output',
              name: { en: 'Output', fr: 'Sorties' },
              type: 'entity',
              kpis: [
                { id: 'output_kpi1', name: { en: 'My KPI #1', fr: 'Mon KPI n°1' } },
                { id: 'output_kpi2', name: { en: 'My KPI #2', fr: 'Mon KPI n°2' } },
                { id: 'output_kpi3', name: { en: 'My KPI #3', fr: 'Mon KPI n°3' } },
              ],
            },
          ],
        },
      },
    },
  },
  {
    id: 'w-ww55o3xd8l39j',
    webApp: {
      options: {
        datasetFilter: [
          'D-4jwyQnmv7jx',
          'D-9rp3EMPO2P2',
          'D-lJVWGqoE6E',
          'd-kyr7pq98y1pn6',
          'd-k6nk7zgl6174y',
          'd-ypl26x3kgppwo',
          'd-5y577r0m19262',
          'd-8o291zn2ozm72',
          'd-dr5xnn710mz4k',
          'd-l6dl6em90ex29',
        ],
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
            functionKey: 'sFGoW45A4TthGp9bunsKhzH7A8a4nR-JK82jjHQ6Ja-WAzFuFc-sOg==',
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
      },
    },
  },
];
