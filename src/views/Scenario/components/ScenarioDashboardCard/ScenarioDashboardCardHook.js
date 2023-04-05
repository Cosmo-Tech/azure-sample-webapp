// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import {
  useCurrentScenarioLastRun,
  useCurrentScenarioLasUpdate,
  useCurrentScenarioState,
} from '../../../../state/hooks/ScenarioHooks';
import { useCurrentScenarioRunStartTime } from '../../../../state/hooks/ScenarioRunHooks';
import { useMemo } from 'react';
import { useFormState } from 'react-hook-form';

export const useScenarioDashboardCard = () => {
  const currentScenarioLastUpdate = useCurrentScenarioLasUpdate();
  const currentScenarioLastRun = useCurrentScenarioLastRun();
  const currentScenarioState = useCurrentScenarioState();
  const currentScenarioRunStartTime = useCurrentScenarioRunStartTime();

  const { isDirty } = useFormState();

  const hasScenarioBeenRun = useMemo(
    () => currentScenarioLastRun !== null && currentScenarioState === 'Successful',
    [currentScenarioLastRun, currentScenarioState]
  );

  const isDashboardSync = useMemo(() => {
    if (isDirty) return false;
    if (!currentScenarioRunStartTime) return true;
    const lastUpdate = new Date(currentScenarioLastUpdate);
    const startTime = new Date(currentScenarioRunStartTime);
    lastUpdate.setSeconds(0);
    lastUpdate.setMilliseconds(0);
    startTime.setSeconds(0);
    startTime.setMilliseconds(0);
    return lastUpdate <= startTime;
  }, [currentScenarioLastUpdate, currentScenarioRunStartTime, isDirty]);

  return { hasScenarioBeenRun, isDashboardSync };
};
