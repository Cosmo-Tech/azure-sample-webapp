// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { ChartArea, Table, Lightbulb, ListChecks, Settings2 } from 'lucide-react';
import React from 'react';
import { Scenario, ScenarioManager, DatasetManager, Dashboards } from '../../views';

const iconStyle = {
  width: '16px',
  height: '16px',
};

export const useMainPage = () => {
  const tabs = [
    {
      key: 'dashboard',
      labelKey: 'layouts.tabs.dashboard.tab.title',
      defaultLabel: 'Dashboard',
      icon: <ChartArea {...iconStyle} />,
      render: <Scenario />,
    },
    {
      key: 'tables',
      labelKey: 'layouts.tabs.tables.tab.title',
      defaultLabel: 'Tables',
      icon: <Table {...iconStyle} />,
      render: <ScenarioManager />,
    },
    {
      key: 'analysis',
      labelKey: 'layouts.tabs.analysis.tab.title',
      defaultLabel: 'Analysis',
      icon: <Lightbulb {...iconStyle} />,
      render: <DatasetManager />,
    },
    {
      key: 'decisions',
      labelKey: 'layouts.tabs.decisions.tab.title',
      defaultLabel: 'Decisions',
      icon: <ListChecks {...iconStyle} />,
      render: <Dashboards />,
    },
    {
      key: 'parameters',
      labelKey: 'layouts.tabs.parameters.tab.title',
      defaultLabel: 'Parameters',
      icon: <Settings2 {...iconStyle} />,
      render: <Dashboards />,
    },
  ];

  return {
    tabs,
  };
};
