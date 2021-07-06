// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { Scenario as ScenarioView, Dashboards } from '../views';
import React from 'react';
import { DistributedTracingModes } from '@microsoft/applicationinsights-web';
import { LOG_TYPES } from '../services/scenarioRun/ScenarioRunConstants.js';
import {
  PowerBIReportEmbedMultipleFilter,
  PowerBIReportEmbedSimpleFilter
} from '@cosmotech/core';

// Tabs configuration
export const tabs = [
  {
    key: 'tabs.scenario.key',
    label: 'layouts.tabs.scenario.tab.title',
    to: '/scenario',
        render: () => <ScenarioView /> // eslint-disable-line
  },
  {
    key: 'tabs.dashboards.key',
    label: 'layouts.tabs.dashboards.tab.title',
    to: '/dashboards',
        render: () => <Dashboards /> // eslint-disable-line
  }
];

// Application Insight configuration
export const applicationInsightConfig = {
  name: 'Web Application Sample',
  config: {
    instrumentationKey: 'f198a852-15d8-48da-9cd0-1e6d18708489',
    disableFetchTracking: false,
    enableCorsCorrelation: true,
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: true,
    enableAutoRouteTracking: true,
    distributedTracingMode: DistributedTracingModes.AI_AND_W3C
  }
};

// For further information about settings or filters see:
// https://github.com/microsoft/powerbi-client-react
// TODO Placeholder when error or not scenario
export const SCENARIO_DASHBOARD_CONFIG =
    {
      reportId: '608b7bef-f5e3-4aae-b8db-19bbb38325d5',
      settings: {
        navContentPaneEnabled: false,
        panes: {
          filters: {
            expanded: true,
            visible: true
          }
        }
      },
      staticFilters: [
        new PowerBIReportEmbedSimpleFilter('Bar', 'id', 'MyBar')
      ],
      dynamicFilters: [
        new PowerBIReportEmbedMultipleFilter('StockProbe', 'SimulationRun', ['lastRun.csmSimulationRun', 'id']),
        new PowerBIReportEmbedSimpleFilter('Bar', 'simulationrun', 'lastRun.csmSimulationRun'),
        new PowerBIReportEmbedSimpleFilter('contains_Customer', 'simulationrun', 'lastRun.csmSimulationRun')
      ],
      pageName: {
        en: 'ReportSectiond5265d03b73060af4244',
        fr: 'ReportSectionca125957a3f5ea936a30'
      }
    };

// TODO Theses parameters for the V1 will be hard-coded.
//  We will have a sort of control panel right before login where it'll be possible to switch between workspace (and more)
export const WORKSPACE_ID = 'W-rXeBwRa0PM';
// Hardcoded value in V1
export const ORGANIZATION_ID = 'O-gZYpnd27G7';

// Log type to download
export const SCENARIO_RUN_LOG_TYPE = LOG_TYPES.CUMULATED_LOGS;

// languages
export const applicationLanguages = {
  en: 'English',
  fr: 'Français'
};
