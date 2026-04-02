// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useScenarioOverride } from '../contexts/ScenarioOverrideContext';
import {
  useCurrentSimulationRunnerData,
  useCurrentSimulationRunnerId,
  useCurrentSimulationRunnerLastRun,
  useCurrentSimulationRunnerLastRunId,
  useCurrentSimulationRunnerLastRunStatus,
  useCurrentSimulationRunnerLastUpdate,
} from '../state/runner/hooks';
import { RunnersUtils } from '../utils';

export const useOverridableCurrentScenarioData = () => {
  const override = useScenarioOverride();
  const reduxData = useCurrentSimulationRunnerData();
  return override?.data ?? reduxData;
};

export const useOverridableCurrentScenarioId = () => {
  const override = useScenarioOverride();
  const reduxId = useCurrentSimulationRunnerId();
  return override?.id ?? reduxId;
};

export const useOverridableCurrentScenarioLastRun = (scenarioId) => {
  const override = useScenarioOverride();
  const reduxLastRun = useCurrentSimulationRunnerLastRun(scenarioId);
  return override ? override.run : reduxLastRun;
};

export const useOverridableCurrentScenarioLastRunId = () => {
  const override = useScenarioOverride();
  const reduxLastRunId = useCurrentSimulationRunnerLastRunId();
  if (override) {
    return RunnersUtils.getLastRunId(override.data);
  }
  return reduxLastRunId;
};

export const useOverridableCurrentScenarioLastRunStatus = () => {
  const override = useScenarioOverride();
  const reduxLastRunStatus = useCurrentSimulationRunnerLastRunStatus();
  if (override) {
    return RunnersUtils.getLastRunStatus(override.data);
  }
  return reduxLastRunStatus;
};

export const useOverridableCurrentScenarioLastUpdate = () => {
  const override = useScenarioOverride();
  const reduxLastUpdate = useCurrentSimulationRunnerLastUpdate();
  if (override) {
    return override.data?.updateInfo?.timestamp;
  }
  return reduxLastUpdate;
};
