// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback } from 'react';
import { SCENARIO_RUN_LOG_TYPE } from '../services/config/FunctionalConstants';
import { LOG_TYPES } from '../services/scenarioRun/ScenarioRunConstants';
import ScenarioRunService from '../services/scenarioRun/ScenarioRunService';
import { useOrganizationId } from '../state/hooks/OrganizationHooks';
import { useCurrentScenarioData } from '../state/hooks/ScenarioHooks';

export const useDownloadLogsFile = () => {
  const currentScenarioData = useCurrentScenarioData();
  const organizationId = useOrganizationId();

  return useCallback(
    () =>
      currentScenarioData?.lastRun
        ? ScenarioRunService.downloadLogsFile(
            organizationId,
            currentScenarioData.lastRun,
            LOG_TYPES[SCENARIO_RUN_LOG_TYPE]
          )
        : null,
    [organizationId, currentScenarioData?.lastRun]
  );
};
