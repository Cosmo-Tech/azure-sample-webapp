// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { ConfigUtils } from './utils';
import {
  AdvancedVisualization,
  Dashboards,
  Instance,
  PixiD3,
  Echarts,
  Scenario,
  ScenarioManager,
  DatasetManager,
} from './views';

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
    key: 'tabs.scenariomanager.key',
    label: 'layouts.tabs.scenariomanager.tab.title',
    to: 'scenariomanager',
    render: <ScenarioManager />,
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
    key: 'tabs.advancedvisualization.key',
    label: 'layouts.tabs.advancedvisualization.tab.title',
    to: 'advancedvisualization',
    render: <AdvancedVisualization />,
  },
  {
    key: 'tabs.pixid3.key',
    label: 'layouts.tabs.pixid3.tab.title',
    to: 'pixid3',
    render: <PixiD3 />,
  },
  {
    key: 'tabs.echarts.key',
    label: 'layouts.tabs.echarts.tab.title',
    to: 'echarts',
    render: <Echarts />,
  },
];

export const getTabsForCurrentWorkspace = (currentWorkspaceData) => {
  return filterTabsForCurrentWorkspace([...DEFAULT_TABS], currentWorkspaceData);
};

export const filterTabsForCurrentWorkspace = (tabs, currentWorkspaceData) => {
  const hideInstanceView = !ConfigUtils.isInstanceViewConfigValid(currentWorkspaceData?.webApp?.options?.instanceView);
  const hideDatasetManager = !ConfigUtils.isDatasetManagerEnabledInWorkspace(currentWorkspaceData);
  const hideDashboardsView = !ConfigUtils.isResultsDisplayEnabledInWorkspace(currentWorkspaceData);

  return tabs.filter((tab) => {
    if (
      (hideInstanceView && tab.key === 'tabs.instance.key') ||
      (hideDatasetManager && tab.key === 'tabs.datasetmanager.key') ||
      (hideDashboardsView && tab.key === 'tabs.dashboards.key')
    )
      return false;
    return true;
  });
};

export const getAllTabs = () => {
  return DEFAULT_TABS;
};
