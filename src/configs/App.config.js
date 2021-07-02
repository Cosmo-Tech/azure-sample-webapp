// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { Scenario as ScenarioView, Dashboards } from '../views';
import React from 'react';
import { DistributedTracingModes } from '@microsoft/applicationinsights-web';
import { LOG_TYPES } from '../services/scenarioRun/ScenarioRunConstants.js';

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

// TODO Theses parameters for the V1 will be hard-coded.
//  We will have a sort of control panel right before login where it'll be possible to switch between workspace (and more)
export const WORKSPACE_ID = 'W-rXeBwRa0PM';
// Hardcoded value in V1
export const ORGANIZATION_ID = 'O-gZYpnd27G7';

// Log type to download
export const SCENARIORUN_LOG_TYPE = LOG_TYPES.CUMULATED_LOGS;

// languages
export const applicationLanguages = {
  en: 'English',
  fr: 'Français'
};
