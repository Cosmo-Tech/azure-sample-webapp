// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCurrentScenario, useFindScenarioById, useUpdateCurrentScenario } from '../state/hooks/ScenarioHooks';
import { useWorkspaceData } from '../state/hooks/WorkspaceHooks';
import { STATUSES } from '../state/commons/Constants';
import { ConfigUtils } from '../utils';

export const useRedirectFromInstanceToSenarioView = () => {
  const isUnmounted = useRef(false);
  const currentWorkspaceData = useWorkspaceData();
  const navigate = useNavigate();

  useEffect(() => {
    if (isUnmounted.current) {
      return;
    }
    const isInstanceViewEnabled = ConfigUtils.isInstanceViewConfigValid(
      currentWorkspaceData?.webApp?.options?.instanceView
    );
    if (isInstanceViewEnabled) return;
    navigate('/workspaces');
    return () => {
      isUnmounted.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWorkspaceData?.webApp?.options?.instanceView]);
};

export const useRedirectionToScenario = (sortedScenarioList) => {
  const isMounted = useRef(false);
  const routerParameters = useParams();
  const currentScenario = useCurrentScenario();
  const navigate = useNavigate();
  const handleScenarioChange = useFindScenarioById();
  const updateCurrentScenario = useUpdateCurrentScenario();

  useEffect(() => {
    if (sortedScenarioList.length !== 0) {
      if (currentScenario?.data?.id === undefined) return;
      if (routerParameters.scenarioId === undefined) {
        navigate(`${currentScenario.data.id}`, { replace: true });
      } else if (currentScenario.data.id !== routerParameters.scenarioId) {
        handleScenarioChange(routerParameters.scenarioId);
        if (!sortedScenarioList?.find((scenario) => scenario.id === routerParameters.scenarioId))
          navigate(`${currentScenario.data.id}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (sortedScenarioList.length > 0 && isMounted.current) {
      if (currentScenario.data === null) {
        handleScenarioChange(sortedScenarioList[0].id);
        navigate(`${sortedScenarioList[0].id}`);
      } else if (currentScenario.data.id !== routerParameters.scenarioId) {
        navigate(`${currentScenario.data.id}`);
        updateCurrentScenario({ status: STATUSES.SUCCESS });
      }
    }
    isMounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScenario?.data?.id]);

  // this function enables backwards navigation between scenario's URLs
  window.onpopstate = (e) => {
    if (currentScenario.data.id !== routerParameters.scenarioId) {
      const scenarioFromUrl = sortedScenarioList.find((el) => el.id === routerParameters.scenarioId);
      if (scenarioFromUrl) handleScenarioChange(scenarioFromUrl.id);
    }
  };
};
