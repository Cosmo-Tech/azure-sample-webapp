// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCurrentScenarioReducerStatus } from '../../../../state/hooks/ScenarioHooks';

export const useBackdropLoadingScenario = () => {
  const currentScenarioStatus = useCurrentScenarioReducerStatus();
  return { currentScenarioStatus };
};
