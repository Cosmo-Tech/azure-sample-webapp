// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { MainPage } from './components/MainPage/MainPage';
import { ConfigUtils } from './utils';
import { Dashboards, Instance, ScenarioManager, ScenariosListingView, DatasetListingView } from './views';

const DEFAULT_TABS = [
  {
    key: 'tabs.scenarioListing.key',
    to: 'scenarios',
    render: <ScenariosListingView />,
  },
  {
    key: 'tabs.scenario.key',
    label: 'layouts.tabs.scenario.tab.title',
    to: 'scenario',
    render: <MainPage />,
  },
  {
    key: 'tabs.datasetListing.key',
    to: 'datasets',
    render: <DatasetListingView />,
  },
  {
    key: 'tabs.scenariomanager.key',
    to: 'scenariomanager',
    render: <ScenarioManager />,
  },
  {
    key: 'tabs.instance.key',
    to: 'instance',
    render: <Instance />,
  },
  {
    key: 'tabs.dashboards.key',
    to: 'dashboards',
    render: <Dashboards />,
  },
];

export const getTabsForCurrentWorkspace = (currentWorkspaceData) => {
  return filterTabsForCurrentWorkspace([...DEFAULT_TABS], currentWorkspaceData);
};

export const filterTabsForCurrentWorkspace = (tabs, currentWorkspaceData) => {
  const hideInstanceView = !ConfigUtils.isInstanceViewConfigValid(
    currentWorkspaceData?.additionalData?.webapp?.instanceView
  );
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
