// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import {
  POWER_BI_FIELD_ENUM,
  PowerBIReportEmbedSimpleFilter,
  PowerBIReportEmbedMultipleFilter,
} from '@cosmotech/azure';

// For further information about settings or filters see:
// https://github.com/microsoft/powerbi-client-react
// based on
// https://github.com/microsoft/PowerBI-JavaScript
// using
// https://github.com/microsoft/powerbi-models

const defaultScenarioViewReport = {
  title: {
    en: 'Scenario dashboard',
    fr: 'Rapport du scenario',
  },
  reportId: '608b7bef-f5e3-4aae-b8db-19bbb38325d5',
  settings: {
    navContentPaneEnabled: false,
    panes: {
      filters: {
        expanded: false,
        visible: false,
      },
    },
  },
  staticFilters: [new PowerBIReportEmbedMultipleFilter('Bar', 'Bar', ['MyBar'])],
  dynamicFilters: [
    new PowerBIReportEmbedSimpleFilter('StockProbe', 'SimulationRun', POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN),
    new PowerBIReportEmbedSimpleFilter('Bar', 'simulationrun', POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN),
    new PowerBIReportEmbedSimpleFilter(
      'contains_Customer',
      'simulationrun',
      POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN
    ),
    new PowerBIReportEmbedSimpleFilter(
      'arc_to_Customer',
      'simulationrun',
      POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN
    ),
    new PowerBIReportEmbedSimpleFilter('parameters', 'simulationrun', POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN),
    new PowerBIReportEmbedSimpleFilter(
      'CustomerSatisfactionProbe',
      'SimulationRun',
      POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN
    ),
  ],
  pageName: {
    en: 'ReportSection',
    fr: 'ReportSection',
  },
};
export const SCENARIO_VIEW_REPORTS_BY_RUNTEMPLATE = {
  1: {
    title: {
      en: 'Scenario dashboard for run type 1',
      fr: 'Rapport du scenario du run type 1',
    },
    reportId: '70ff6a53-04f9-4076-93c0-328426b78c8f',
    settings: {
      navContentPaneEnabled: true,
      filterPaneEnabled: true,
      panes: {
        filters: {
          expanded: true,
          visible: true,
        },
      },
    },
    staticFilters: [new PowerBIReportEmbedMultipleFilter('Bar', 'Bar', ['MyBar'])],
    dynamicFilters: [
      new PowerBIReportEmbedSimpleFilter(
        'StockProbe',
        'SimulationRun',
        POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN
      ),
      new PowerBIReportEmbedSimpleFilter(
        'contains_Customer',
        'simulationrun',
        POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN
      ),
    ],
    pageName: {
      en: 'ReportSection',
      fr: 'ReportSection',
    },
  },
  2: defaultScenarioViewReport,
  3: defaultScenarioViewReport,
};
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
      fr: 'Structure du jumeau numérique',
    },
    reportId: '608b7bef-f5e3-4aae-b8db-19bbb38325d5',
    settings: {
      navContentPaneEnabled: false,
      panes: {
        filters: {
          expanded: true,
          visible: true,
        },
      },
    },
    dynamicFilters: [
      new PowerBIReportEmbedSimpleFilter(
        'StockProbe',
        'SimulationRun',
        POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN
      ),
      new PowerBIReportEmbedSimpleFilter('Bar', 'simulationrun', POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN),
      new PowerBIReportEmbedSimpleFilter(
        'contains_Customer',
        'simulationrun',
        POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN
      ),
      new PowerBIReportEmbedSimpleFilter(
        'arc_to_Customer',
        'simulationrun',
        POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN
      ),
      new PowerBIReportEmbedSimpleFilter(
        'parameters',
        'simulationrun',
        POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN
      ),
      new PowerBIReportEmbedSimpleFilter(
        'CustomerSatisfactionProbe',
        'SimulationRun',
        POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN
      ),
    ],
    pageName: {
      en: 'ReportSectionf3ef30b8ad34c9c2e8c4',
      fr: 'ReportSectionf3ef30b8ad34c9c2e8c4',
    },
  },
  {
    title: {
      en: 'Stocks Follow-up',
      fr: 'Suivi de stock',
    },
    reportId: '608b7bef-f5e3-4aae-b8db-19bbb38325d5',
    settings: {
      navContentPaneEnabled: false,
      panes: {
        filters: {
          expanded: true,
          visible: true,
        },
      },
    },
    dynamicFilters: [
      new PowerBIReportEmbedSimpleFilter(
        'StockProbe',
        'SimulationRun',
        POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN
      ),
      new PowerBIReportEmbedSimpleFilter('Bar', 'simulationrun', POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN),
      new PowerBIReportEmbedSimpleFilter(
        'contains_Customer',
        'simulationrun',
        POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN
      ),
      new PowerBIReportEmbedSimpleFilter(
        'arc_to_Customer',
        'simulationrun',
        POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN
      ),
      new PowerBIReportEmbedSimpleFilter(
        'parameters',
        'simulationrun',
        POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN
      ),
      new PowerBIReportEmbedSimpleFilter(
        'CustomerSatisfactionProbe',
        'SimulationRun',
        POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN
      ),
    ],
    pageName: {
      en: 'ReportSectionca125957a3f5ea936a30',
      fr: 'ReportSectionca125957a3f5ea936a30',
    },
  },
  {
    title: {
      en: 'Customer Satisfaction',
      fr: 'Satisfaction client',
    },
    reportId: '608b7bef-f5e3-4aae-b8db-19bbb38325d5',
    settings: {
      navContentPaneEnabled: false,
      panes: {
        filters: {
          expanded: false,
          visible: true,
        },
      },
    },
    dynamicFilters: [
      new PowerBIReportEmbedSimpleFilter(
        'StockProbe',
        'SimulationRun',
        POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN
      ),
      new PowerBIReportEmbedSimpleFilter('Bar', 'simulationrun', POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN),
      new PowerBIReportEmbedSimpleFilter(
        'contains_Customer',
        'simulationrun',
        POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN
      ),
      new PowerBIReportEmbedSimpleFilter(
        'arc_to_Customer',
        'simulationrun',
        POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN
      ),
      new PowerBIReportEmbedSimpleFilter(
        'parameters',
        'simulationrun',
        POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN
      ),
      new PowerBIReportEmbedSimpleFilter(
        'CustomerSatisfactionProbe',
        'SimulationRun',
        POWER_BI_FIELD_ENUM.SCENARIO_CSM_SIMULATION_RUN
      ),
    ],
    pageName: {
      en: 'ReportSectiond5265d03b73060af4244',
      fr: 'ReportSectiond5265d03b73060af4244',
    },
  },
];
