// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { Dashboards, Scenario, ScenarioManager } from '../views';
import React from 'react';
import { DistributedTracingModes } from '@microsoft/applicationinsights-web';
import { LOG_TYPES } from '../services/scenarioRun/ScenarioRunConstants.js';
import {
  POWER_BI_FIELD_ENUM, PowerBIReportEmbedMultipleFilter,
  PowerBIReportEmbedSimpleFilter
} from '@cosmotech/azure';

// Tabs configuration
export const tabs = [
  {
    key: 'tabs.scenario.key',
    label: 'layouts.tabs.scenario.tab.title',
    to: '/scenario',
      render: () => <Scenario /> // eslint-disable-line
  },
  {
    key: 'tabs.scenariomanager.key',
    label: 'layouts.tabs.scenariomanager.tab.title',
    to: '/scenariomanager',
      render: () => <ScenarioManager /> // eslint-disable-line
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
// based on
// https://github.com/microsoft/PowerBI-JavaScript
// using
// https://github.com/microsoft/powerbi-models

export const SCENARIO_DASHBOARD_CONFIG = [
  {
    title: {
      en: 'Scenario dashboard',
      fr: 'Rapport du scenario'
    },
    reportId: '608b7bef-f5e3-4aae-b8db-19bbb38325d5',
    settings: {
      navContentPaneEnabled: false,
      panes: {
        filters: {
          expanded: false,
          visible: false
        }
      }
    },
    staticFilters: [
      new PowerBIReportEmbedMultipleFilter('Bar', 'id', ['MyBar', 'MyBar2'])
    ],
    dynamicFilters: [
      new PowerBIReportEmbedSimpleFilter('StockProbe', 'SimulationRun', POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN)
    ],
    pageName: {
      en: 'ReportSection',
      fr: 'ReportSection'
    }
  }
];

// For further information about settings or filters see:
// https://github.com/microsoft/powerbi-client-react
// based on
// https://github.com/microsoft/PowerBI-JavaScript
// using
// https://github.com/microsoft/powerbi-models
export const DASHBOARDS_LIST_CONFIG = [
  {
    title: {
      en: 'Digital Twin Structure',
      fr: 'Structure du jumeau numérique'
    },
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
    dynamicFilters: [
      new PowerBIReportEmbedSimpleFilter('StockProbe', 'SimulationRun', POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN),
      new PowerBIReportEmbedSimpleFilter('Bar', 'simulationrun', POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN),
      new PowerBIReportEmbedSimpleFilter('contains_Customer', 'simulationrun', POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN),
      new PowerBIReportEmbedSimpleFilter('arc_to_Customer', 'simulationrun', POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN),
      new PowerBIReportEmbedSimpleFilter('parameters', 'simulationrun', POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN),
      new PowerBIReportEmbedSimpleFilter('CustomerSatisfactionProbe', 'SimulationRun', POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN)
    ],
    pageName: {
      en: 'ReportSectionf3ef30b8ad34c9c2e8c4',
      fr: 'ReportSectionf3ef30b8ad34c9c2e8c4'
    }
  },
  {
    title: {
      en: 'Stocks Follow-up',
      fr: 'Suivi de stock'
    },
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
    dynamicFilters: [
      new PowerBIReportEmbedSimpleFilter('StockProbe', 'SimulationRun', POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN),
      new PowerBIReportEmbedSimpleFilter('Bar', 'simulationrun', POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN),
      new PowerBIReportEmbedSimpleFilter('contains_Customer', 'simulationrun', POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN),
      new PowerBIReportEmbedSimpleFilter('arc_to_Customer', 'simulationrun', POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN),
      new PowerBIReportEmbedSimpleFilter('parameters', 'simulationrun', POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN),
      new PowerBIReportEmbedSimpleFilter('CustomerSatisfactionProbe', 'SimulationRun', POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN)
    ],
    pageName: {
      en: 'ReportSectionca125957a3f5ea936a30',
      fr: 'ReportSectionca125957a3f5ea936a30'
    }
  },
  {
    title: {
      en: 'Customer Satisfaction',
      fr: 'Satisfaction client'
    },
    reportId: '608b7bef-f5e3-4aae-b8db-19bbb38325d5',
    settings: {
      navContentPaneEnabled: false,
      panes: {
        filters: {
          expanded: false,
          visible: true
        }
      }
    },
    dynamicFilters: [
      new PowerBIReportEmbedSimpleFilter('StockProbe', 'SimulationRun', POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN),
      new PowerBIReportEmbedSimpleFilter('Bar', 'simulationrun', POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN),
      new PowerBIReportEmbedSimpleFilter('contains_Customer', 'simulationrun', POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN),
      new PowerBIReportEmbedSimpleFilter('arc_to_Customer', 'simulationrun', POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN),
      new PowerBIReportEmbedSimpleFilter('parameters', 'simulationrun', POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN),
      new PowerBIReportEmbedSimpleFilter('CustomerSatisfactionProbe', 'SimulationRun', POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN)
    ],
    pageName: {
      en: 'ReportSectiond5265d03b73060af4244',
      fr: 'ReportSectiond5265d03b73060af4244'
    }
  }

];

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
