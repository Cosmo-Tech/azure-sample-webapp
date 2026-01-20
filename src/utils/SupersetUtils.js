// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { RunnersUtils } from './RunnersUtils';

const DEFAULT_EXPAND_FILTERS = false;
const DEFAULT_HIDE_FILTERS = false;
const DEFAULT_HIDE_CHART_CONTROLS = false;
const DEFAULT_HIDE_TITLE = true;

const resolveDynamicValue = (key, context) => {
  const { currentScenarioData, visibleScenarios } = context;

  const dynamic = {
    id: () => currentScenarioData?.id,
    lastRunId: () => RunnersUtils.getLastRunId(currentScenarioData),
    state: () => RunnersUtils.getLastRunStatus(currentScenarioData),
    name: () => currentScenarioData?.name,
    masterId: () => currentScenarioData?.rootId,
    parentId: () => currentScenarioData?.parentId,
    ownerId: () => currentScenarioData?.createInfo?.userId,
    solutionId: () => currentScenarioData?.solutionId,

    visibleScenariosIds: () => visibleScenarios?.map((s) => s.id),
    visibleScenariosSimulationRunsIds: () => visibleScenarios?.map((s) => RunnersUtils.getLastRunId(s)),
  };

  const resolver = dynamic[key];
  return resolver ? resolver() : key; // fallback to static value
};

const forgeNativeFilters = (dashboardFilters, visibleScenarios, currentScenarioData) => {
  const nativeFilters = [];
  for (const filter of dashboardFilters ?? []) {
    if (typeof filter !== 'object') continue;

    const { id, column, operator, value } = filter;
    if (!id || !column || !operator || !value) {
      console.warn('[Dynamic Filters] Invalid filter configuration detected:', filter);
      continue;
    }

    const dynamicResolved = resolveDynamicValue(value, { currentScenarioData, visibleScenarios });
    const valuesArray = Array.isArray(dynamicResolved) ? dynamicResolved : [dynamicResolved];
    const nativeExpr = valuesArray
      .map(
        (value) =>
          `(NATIVE_FILTER-${id}:` +
          `(__cache:(label:'${value}',validateStatus:!f,value:!('${value}')),` +
          `extraFormData:(filters:!((col:'${column}',op:'${operator}',val:!('${value}')))),` +
          `filterState:(label:'${value}',validateStatus:!f,value:!('${value}')),` +
          `id:NATIVE_FILTER-${id},ownState:()))`
      )
      .join(',');

    nativeFilters.push(nativeExpr);
  }

  return nativeFilters.length > 0 ? nativeFilters.join(',') : undefined;
};

const returnBoolValueOrDefault = (value, defaultValue) => {
  if (value == null) return defaultValue;
  if (typeof value === 'boolean') return value;

  console.warn('Invalid value in superset UI config options (a boolean value was expected)');
  return defaultValue;
};

const forgeUiConfig = (dashboardConfig, visibleScenarios, currentScenarioData) => {
  const nativeFiltersParam = forgeNativeFilters(dashboardConfig?.filters, visibleScenarios, currentScenarioData);

  return {
    hideTitle: returnBoolValueOrDefault(dashboardConfig?.hideTitle, DEFAULT_HIDE_TITLE),
    hideChartControls: returnBoolValueOrDefault(dashboardConfig?.hideChartControls, DEFAULT_HIDE_CHART_CONTROLS),
    filters: {
      expanded: returnBoolValueOrDefault(dashboardConfig?.expandFilters, DEFAULT_EXPAND_FILTERS),
      visible: !returnBoolValueOrDefault(dashboardConfig?.hideFilters, DEFAULT_HIDE_FILTERS),
    },
    urlParams: nativeFiltersParam ? { native_filters: nativeFiltersParam } : {},
  };
};

export const forgeReport = (dashboardConfig, visibleScenarios, currentScenarioData) => {
  return {
    id: dashboardConfig.id,
    height: dashboardConfig.height,
    width: dashboardConfig.width,
    uiConfig: forgeUiConfig(dashboardConfig, visibleScenarios, currentScenarioData),
  };
};
