// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { ConfigUtils } from './utils';
import { Dashboards, Instance, Scenario, ScenarioManager, DatasetManager } from './views';

const DEFAULT_TABS = [
  {
    key: 'tabs.datasetmanager.key',
    label: 'layouts.tabs.datasetmanager.tab.title',
    to: 'datasetmanager',
    render: <DatasetManager />,
  },
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
  const hideInstanceView = !ConfigUtils.isInstanceViewConfigValid(currentWorkspaceData?.webApp?.options?.instanceView);
  const hideDatasetManager = !ConfigUtils.isDatasetManagerEnabledInWorkspace(currentWorkspaceData);

  return tabs.filter((tab) => {
    if (
      (hideInstanceView && tab.key === 'tabs.instance.key') ||
      (hideDatasetManager && tab.key === 'tabs.datasetmanager.key')
    )
      return false;
    return true;
  });
};

export const getAllTabs = () => {
  return DEFAULT_TABS;
};
