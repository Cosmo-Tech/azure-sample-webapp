// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { Dashboards, Scenario, ScenarioManager } from './views';

// Tabs configuration
export const TABS = [
  {
    key: 'tabs.scenario.key',
    label: 'layouts.tabs.scenario.tab.title',
    to: '/scenario',
      render: () => <Scenario /> // eslint-disable-line
  },
  {
    key: 'tabs.dashboards.key',
    label: 'layouts.tabs.dashboards.tab.title',
    to: '/dashboards',
    render: () => <Dashboards /> // eslint-disable-line
  },
  {
    key: 'tabs.scenariomanager.key',
    label: 'layouts.tabs.scenariomanager.tab.title',
    to: '/scenariomanager',
      render: () => <ScenarioManager /> // eslint-disable-line
  }
];
