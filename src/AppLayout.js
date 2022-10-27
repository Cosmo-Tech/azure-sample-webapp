// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { Dashboards, Instance, Scenario, ScenarioManager } from './views';
import { IS_INSTANCE_VIEW_FUNCTION_CONFIG_VALID } from './views/Instance/data';

// Tabs configuration
const TABS = [
  {
    key: 'tabs.scenario.key',
    label: 'layouts.tabs.scenario.tab.title',
    to: 'scenario',
    render: <Scenario />, // eslint-disable-line
  },
  {
    key: 'tabs.dashboards.key',
    label: 'layouts.tabs.dashboards.tab.title',
    to: 'dashboards',
    render: <Dashboards />, // eslint-disable-line
  },
  {
    key: 'tabs.scenariomanager.key',
    label: 'layouts.tabs.scenariomanager.tab.title',
    to: 'scenariomanager',
    render: <ScenarioManager />, // eslint-disable-line
  },
];

if (IS_INSTANCE_VIEW_FUNCTION_CONFIG_VALID) {
  TABS.splice(1, 0, {
    key: 'tabs.instance.key',
    label: 'layouts.tabs.instance.tab.title',
    to: 'instance',
    render: <Instance />, // eslint-disable-line
  });
}

export { TABS };
