// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const defaultScenarioViewReport = {
  title: { en: 'Scenario dashboard', fr: 'Rapport du scenario' },
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
    id: 'W-rXeBwRa0PM',
    webapp: {
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
          ],
          scenarioView: {
            1: {
              title: { en: 'Scenario dashboard for run type 1', fr: 'Rapport du scenario du run type 1' },
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
      },
    },
  },
];
