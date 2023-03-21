// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { Dashboards, Instance, Scenario, ScenarioManager } from './views';
import { ConfigUtils } from './utils';

const DEFAULT_TABS = [
  {
    key: 'tabs.scenario.key',
    label: 'layouts.tabs.scenario.tab.title',
    to: 'scenario',
    render: <Scenario />,
  },
  {
    key: 'tabs.instance.key',
    label: 'layouts.tabs.instance.tab.title',
    to: 'instance',
    render: <Instance />,
  },
  {
    key: 'tabs.dashboards.key',
    label: 'layouts.tabs.dashboards.tab.title',
    to: 'dashboards',
    render: <Dashboards />,
  },
  {
    key: 'tabs.scenariomanager.key',
    label: 'layouts.tabs.scenariomanager.tab.title',
    to: 'scenariomanager',
    render: <ScenarioManager />,
  },
];

export const getTabsForCurrentWorkspace = (currentWorkspaceData) => {
  return filterTabsForCurrentWorkspace([...DEFAULT_TABS], currentWorkspaceData);
};

export const filterTabsForCurrentWorkspace = (tabs, currentWorkspaceData) => {
  if (!ConfigUtils.isInstanceViewConfigValid(currentWorkspaceData?.webApp?.options?.instanceView)) {
    return tabs.filter((tab) => tab.key !== 'tabs.instance.key');
  }
  return tabs;
};

export const getAllTabs = () => {
  return DEFAULT_TABS;
};
