// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
export const buildSupersetUrlParams = (reportConfig, context, contextType = 'scenario') => {
  const { currentScenarioData, visibleScenarios } = context;
  if (!reportConfig?.dynamicFilters) return {};

  const preselectFilters = {};

  for (const filter of reportConfig.dynamicFilters) {
    const { chartId, column, values } = filter;
    let resolvedValues;

    if (contextType === 'scenario') {
      if (values === 'csmSimulationRun') resolvedValues = [currentScenarioData?.lastRun?.csmSimulationRun];
      else if (values === 'lastRunId') resolvedValues = [currentScenarioData?.lastRunId];
    } else if (contextType === 'dashboards') {
      if (values === 'visibleScenariosCsmSimulationRunsIds')
        resolvedValues = visibleScenarios?.map((s) => s.lastRun?.csmSimulationRun);
      else if (values === 'visibleScenariosSimulationRunsIds') resolvedValues = visibleScenarios?.map((s) => s.runId);
    }

    if (resolvedValues?.length) {
      preselectFilters[chartId] = { [column]: resolvedValues.filter(Boolean) };
    }
  }

  return { preselect_filters: JSON.stringify(preselectFilters) };
};
