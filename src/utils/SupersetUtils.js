// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { RunnersUtils } from './RunnersUtils';

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

export const forgeNativeFilters = (dashboardFilters, visibleScenarios, currentScenarioData) => {
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
