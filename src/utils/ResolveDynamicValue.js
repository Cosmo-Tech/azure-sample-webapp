import { RunnersUtils } from './RunnersUtils';

export function resolveDynamicValue(key, context) {
  const { currentScenarioData, visibleScenarios } = context;
  const lastRunId = RunnersUtils.getLastRunId(currentScenarioData);

  const dynamic = {
    id: () => currentScenarioData?.id,
    lastRunId: () => lastRunId,
    state: () => currentScenarioData?.lastRunInfo?.lastRunStatus,
    name: () => currentScenarioData?.name,
    masterId: () => currentScenarioData?.rootId,
    parentId: () => currentScenarioData?.parentId,
    ownerId: () => currentScenarioData?.createInfo?.userId,
    solutionId: () => currentScenarioData?.solutionId,

    visibleScenariosIds: () => visibleScenarios?.map((s) => s.id),

    visibleScenariosSimulationRunsIds: () => visibleScenarios?.map((s) => RunnersUtils.getLastRunId(s)),

    visibleScenariosCsmSimulationRunsIds: () => visibleScenarios?.map((s) => s.lastRun?.csmSimulationRun),
  };

  const resolver = dynamic[key];
  return resolver ? resolver() : key; // fallback to static value
}
