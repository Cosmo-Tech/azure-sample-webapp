// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const defaultScenarioViewReport = {
  title: { en: 'Scenario dashboard', fr: 'Rapport du scénario' },
  reportId: '29ca639e-640c-41eb-b5f4-d0f7b5fbadd3',
  settings: { navContentPaneEnabled: false, panes: { filters: { expanded: true, visible: true } } },
  staticFilters: [],
  dynamicFilters: [],
  pageName: { en: '2bb90bb985a714773489', fr: '2bb90bb985a714773489' },
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
          dashboardsView: [defaultScenarioViewReport],
          scenarioView: {
            1: defaultScenarioViewReport,
            2: defaultScenarioViewReport,
            3: defaultScenarioViewReport,
          },
        },
      },
    },
  },
];
