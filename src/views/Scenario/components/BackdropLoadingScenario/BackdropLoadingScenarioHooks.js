// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCurrentSimulationRunnerReducerStatus } from '../../../../state/hooks/RunnerHooks';

export const useBackdropLoadingScenario = () => {
  const currentScenarioStatus = useCurrentSimulationRunnerReducerStatus();
  return { currentScenarioStatus };
};
