// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCurrentScenario, useFindScenarioById, useUpdateCurrentScenario } from '../state/hooks/ScenarioHooks';
import { STATUSES } from '../state/commons/Constants';

export const useRedirectionToScenario = (sortedScenarioList, view) => {
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
        navigate(`${routerParameters.scenarioId}`);
      }
    } else {
      navigate(`/${routerParameters.workspaceId}/${view}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (sortedScenarioList.length > 0 && isMounted.current) {
      if (currentScenario.data === null) {
        handleScenarioChange(sortedScenarioList[0].id);
        navigate(`${sortedScenarioList[0].id}`);
      } else if (currentScenario.data.id !== routerParameters.scenarioId && routerParameters.scenarioId !== undefined) {
        navigate(`${currentScenario.data.id}`);
        updateCurrentScenario({ status: STATUSES.SUCCESS });
      }
    }
    isMounted.current = true;
    // eslint-disable-next-line
  }, [currentScenario?.data?.id]);
};
