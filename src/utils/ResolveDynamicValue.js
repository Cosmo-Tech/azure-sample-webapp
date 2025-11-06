import { RunnersUtils } from './RunnersUtils';

export function resolveDynamicValue(key, context) {
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
}
