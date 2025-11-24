// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useMemo } from 'react';
import { useSortedScenarioList } from '../../hooks/ScenarioListHooks';
import { STATUSES } from '../../services/config/StatusConstants';
import { useApplicationTheme } from '../../state/app/hooks';
import { useUserEmail, useUserProfilePic } from '../../state/auth/hooks';
import {
  useCurrentSimulationRunnerData,
  useCurrentSimulationRunnerReducerStatus,
  useSelectRunner,
} from '../../state/runner/hooks';
import { useWorkspaceId } from '../../state/workspaces/hooks';

export const useMainNavigation = () => {
  const { isDarkTheme } = useApplicationTheme();
  const workspaceId = useWorkspaceId();
  const currentScenarioData = useCurrentSimulationRunnerData();
  const userEmail = useUserEmail();
  const userProfilePic = useUserProfilePic();

  const changeScenario = useSelectRunner();

  const sortedScenarioList = useSortedScenarioList();
  const currentScenarioStatus = useCurrentSimulationRunnerReducerStatus();

  const isSwitchingScenario = useMemo(() => currentScenarioStatus === STATUSES.LOADING, [currentScenarioStatus]);
  const noScenario = currentScenarioData === null || sortedScenarioList.length === 0;

  const userName = useMemo(() => {
    if (userEmail) {
      const parts = userEmail.split('@')[0].split('.');
      if (parts.length >= 2) {
        return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
      }
      return userEmail.split('@')[0];
    }
    return 'Anonymous';
  }, [userEmail]);

  return {
    currentScenarioData,
    workspaceId,
    changeScenario,
    isSwitchingScenario,
    noScenario,
    sortedScenarioList,
    userEmail,
    userName,
    userProfilePic,
    isDarkTheme,
  };
};
