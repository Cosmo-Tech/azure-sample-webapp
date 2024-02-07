// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import rfdc from 'rfdc';
import { PowerBIReportEmbedMultipleFilter, PowerBIReportEmbedSimpleFilter } from '@cosmotech/azure';

const clone = rfdc();

const _forgeFilter = (filter) => {
  if (Array.isArray(filter.values)) {
    return new PowerBIReportEmbedMultipleFilter(filter.table, filter.column, filter.values);
  }
  return new PowerBIReportEmbedSimpleFilter(filter.table, filter.column, filter.values);
};

const _forgeFilters = (filters) => {
  if (filters == null) return filters;
  return filters.map((filter) => _forgeFilter(filter));
};

const _forgeFiltersInReportConfig = (reportConfig) => {
  if (reportConfig.staticFilters) reportConfig.staticFilters = _forgeFilters(reportConfig.staticFilters);
  if (reportConfig.dynamicFilters) reportConfig.dynamicFilters = _forgeFilters(reportConfig.dynamicFilters);
};

// Reports config can have several shapes:
//  - an object describing reports by run template id
//  - an array of objects, each object describing a single report
const _fillReportsConfig = (reportsConfig) => {
  if (!reportsConfig) return reportsConfig;

  if (Array.isArray(reportsConfig)) {
    return reportsConfig.map((reportConfig) => _forgeFiltersInReportConfig(reportConfig));
  }
  Object.values(reportsConfig).forEach((reportConfig) => _forgeFiltersInReportConfig(reportConfig));
};

const fillChartsConfig = (chartsConfig) => {
  const newChartsConfig = clone(chartsConfig);
  _fillReportsConfig(newChartsConfig?.dashboardsView);
  _fillReportsConfig(newChartsConfig?.scenarioView);
  return newChartsConfig;
};

const getScenarioViewReportConfig = (reportsConfig, runTemplateId) => {
  if (!reportsConfig) return [];
  return Array.isArray(reportsConfig)
    ? reportsConfig
    : runTemplateId in reportsConfig
      ? [reportsConfig[runTemplateId]]
      : [];
};

const _getReportsIdsFromDashboardsViewConfig = (reportsConfig) => reportsConfig.map((report) => report.reportId);
const _getReportsIdsFromScenarioViewConfig = (reportsConfig) => {
  if (Array.isArray(reportsConfig)) {
    return reportsConfig.map((report) => report.reportId);
  }
  return Object.values(reportsConfig).map((report) => report.reportId);
};

const getReportsIdsFromConfig = (config) => {
  return Array.from(
    new Set([
      ..._getReportsIdsFromDashboardsViewConfig(config?.dashboardsView ?? []),
      ..._getReportsIdsFromScenarioViewConfig(config?.scenarioView ?? []),
    ])
  );
};

export const PowerBIUtils = {
  fillChartsConfig,
  getReportsIdsFromConfig,
  getScenarioViewReportConfig,
};
