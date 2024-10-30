// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const scenarioViewReport = {
  title: { en: 'Scenario dashboard', fr: 'Rapport du scénario' },
  reportId: '5a28099a-6dfc-4542-ba6f-f8db2d5a9587',
  settings: { navContentPaneEnabled: false, panes: { filters: { expanded: false, visible: true } } },
  staticFilters: [],
  dynamicFilters: [
    { table: 'bar_stock', column: 'simulation_run', values: 'lastRunId' },
    { table: 'customer_satisfaction', column: 'simulation_run', values: 'lastRunId' },
  ],
  pageName: { en: 'ReportSection', fr: 'ReportSection' },
};

const scenarioComparisonReport = {
  title: { en: 'Scenario comparison', fr: 'Comparaison de scénarios' },
  reportId: '5a28099a-6dfc-4542-ba6f-f8db2d5a9587',
  settings: { navContentPaneEnabled: false, panes: { filters: { expanded: false, visible: true } } },
  staticFilters: [],
  dynamicFilters: [
    { table: 'bar_stock', column: 'simulation_run', values: 'lastRunId' },
    { table: 'customer_satisfaction', column: 'simulation_run', values: 'lastRunId' },
  ],
  pageName: { en: 'ReportSection99fca3e46d5107c9ddea', fr: 'ReportSection99fca3e46d5107c9ddea' },
};

// Use the WORKSPACES array below to override or add information to your workspaces. This can be useful for development
// purposes, but it is recommended to leave this array empty and use the API to update your Workspace instead for
// production environments.
export const WORKSPACES = [
  {
    id: 'w-314qryelkyop5',
    webApp: {
      options: {
        charts: {
          workspaceId: '290de699-9026-42c0-8c83-e4e87c3f22dd',
          logInWithUserCredentials: false,
          scenarioViewIframeDisplayRatio: 1580 / 350,
          dashboardsViewIframeDisplayRatio: 1280 / 795,
          dashboardsView: [scenarioComparisonReport],
          scenarioView: [scenarioViewReport],
        },
      },
    },
  },
];
