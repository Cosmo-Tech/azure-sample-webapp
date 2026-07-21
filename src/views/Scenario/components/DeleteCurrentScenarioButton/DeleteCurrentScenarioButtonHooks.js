// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import {
  useCurrentSimulationRunnerData,
  useCurrentSimulationRunnerLastRunStatus,
  useDeleteRunner,
} from '../../../../state/runner/hooks';

export const useDeleteCurrentScenarioButton = () => {
  const currentScenario = useCurrentSimulationRunnerData();
  const currentScenarioLastRunStatus = useCurrentSimulationRunnerLastRunStatus();
  const deleteScenario = useDeleteRunner();
  return {
    deleteScenario,
    currentScenario,
    currentScenarioLastRunStatus,
  };
};
