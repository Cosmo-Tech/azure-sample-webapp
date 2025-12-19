import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useSortedScenarioList } from '../../hooks/ScenarioListHooks';
import { STATUSES } from '../../services/config/StatusConstants';
import { useApplicationTheme } from '../../state/app/hooks';
import { useUserEmail, useUserName, useUserProfilePic } from '../../state/auth/hooks';
import {
  useCurrentSimulationRunnerData,
  useCurrentSimulationRunnerReducerStatus,
  useSelectRunner,
} from '../../state/runner/hooks';
import { useWorkspaceId } from '../../state/workspaces/hooks';
import { setActiveSection } from './reducers';

export const useMainNavigation = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { isDarkTheme } = useApplicationTheme();
  const workspaceId = useWorkspaceId();
  const currentScenarioData = useCurrentSimulationRunnerData();
  const userEmail = useUserEmail();
  const userName = useUserName();
  const userProfilePic = useUserProfilePic();
  const changeScenario = useSelectRunner();
  const sortedScenarioList = useSortedScenarioList();
  const currentScenarioStatus = useCurrentSimulationRunnerReducerStatus();

  const sections = useSelector((state) => state.mainNavigation.sections);
  const activeSection = useSelector((state) => state.mainNavigation.activeSection);

  const isSwitchingScenario = useMemo(() => currentScenarioStatus === STATUSES.LOADING, [currentScenarioStatus]);

  const noScenario = currentScenarioData === null || sortedScenarioList.length === 0;

  const derivedSection = useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    const section = segments[1];

    if (section === 'scenarios' || section === 'scenario') return 'scenarios';
    if (section === 'datasets') return 'datasets';
    if (section === 'scorecard') return 'scorecard';

    return 'datasets';
  }, [location.pathname]);

  useEffect(() => {
    if (derivedSection !== activeSection) {
      dispatch(setActiveSection(derivedSection));
    }
  }, [derivedSection, activeSection, dispatch]);

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
    activeSection,
    sections,
  };
};
