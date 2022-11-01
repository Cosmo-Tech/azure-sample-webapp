// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCurrentScenario, useFindScenarioById, useUpdateCurrentScenario } from '../state/hooks/ScenarioHooks';
import { useWorkspace } from '../state/hooks/WorkspaceHooks';
import { STATUSES } from '../state/commons/Constants';

export const useRedirectionToScenario = (sortedScenarioList) => {
  const routerParameters = useParams();
  const currentScenario = useCurrentScenario();
  const navigate = useNavigate();
  const handleScenarioChange = useFindScenarioById();
  const currentWorkspace = useWorkspace();
  const updateCurrentScenario = useUpdateCurrentScenario();
  useEffect(() => {
    if (sortedScenarioList.length !== 0) {
      if (currentScenario?.data?.id === undefined) return;
      if (routerParameters.scenarioId === undefined) {
        navigate(`${currentScenario.data.id}`);
      } else if (currentScenario.data.id !== routerParameters.scenarioId) {
        handleScenarioChange(currentWorkspace.data.id, routerParameters.scenarioId);
        navigate(`${routerParameters.scenarioId}`);
      }
    } else {
      navigate(`/${routerParameters.workspaceId}/scenario`);
    }
  }, []);
  useEffect(() => {
    if (currentScenario?.data?.id === undefined) return;
    if (sortedScenarioList.length > 0) {
      if (currentScenario.data === null) {
        handleScenarioChange(currentWorkspace.data.id, sortedScenarioList[0].id);
        navigate(`${sortedScenarioList[0].id}`);
      } else if (currentScenario.data.id !== routerParameters.scenarioId) {
        navigate(`${currentScenario.data.id}`);
        updateCurrentScenario({ status: STATUSES.SUCCESS });
      }
    }
    // eslint-disable-next-line
    }, [currentScenario?.data?.id]);
};
