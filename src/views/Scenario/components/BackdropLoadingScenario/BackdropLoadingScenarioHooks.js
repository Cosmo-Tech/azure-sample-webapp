// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useMemo } from 'react';
import { STATUSES } from '../../../../state/commons/Constants';
import { useCurrentScenarioReducerStatus } from '../../../../state/hooks/ScenarioHooks';

export const useBackdropLoadingScenario = () => {
  const currentScenarioStatus = useCurrentScenarioReducerStatus();

  const showBackdrop = useMemo(() => {
    return currentScenarioStatus === STATUSES.LOADING || currentScenarioStatus === STATUSES.SAVING;
  }, [currentScenarioStatus]);

  return { currentScenarioStatus, showBackdrop };
};
