// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { Scenario as ScenarioView } from '../views';
import React from 'react';
import { DistributedTracingModes } from '@microsoft/applicationinsights-web';

// Tabs configuration
export const tabs = [
  {
    key: 'tabs.scenario.key',
    label: 'layouts.tabs.scenario.tab.title',
    to: '/scenario',
        render: () => <ScenarioView /> // eslint-disable-line
  }
];

// Application Insight configuration
export const applicationInsightConfig = {
  name: 'Web Application Sample',
  config: {
    instrumentationKey: '05ef985d-8209-46db-acb0-d035da80faa1',
    disableFetchTracking: false,
    enableCorsCorrelation: true,
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: true,
    enableAutoRouteTracking: true,
    distributedTracingMode: DistributedTracingModes.AI_AND_W3C
  }
};

// TODO Theses parameters for the V1 will be hard-coded.
//  We will have a sort of control panel right before login where you'll be able to switch between workspace (and more)
export const WORKSPACE_ID = '1';
// Hardcoded value in V1
export const ORGANISATION_ID = '1';

// languages
export const applicationLanguages = {
  en: 'English',
  fr: 'Français'
};
