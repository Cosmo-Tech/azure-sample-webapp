// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useMemo } from 'react';
import { STATUSES } from '../../../../services/config/StatusConstants';
import { useCurrentSimulationRunnerReducerStatus } from '../../../../state/runner/hooks';

export const useBackdropLoadingScenario = () => {
  const currentScenarioStatus = useCurrentSimulationRunnerReducerStatus();

  const showBackdrop = useMemo(() => {
    return currentScenarioStatus === STATUSES.LOADING || currentScenarioStatus === STATUSES.SAVING;
  }, [currentScenarioStatus]);

  return { currentScenarioStatus, showBackdrop };
};
