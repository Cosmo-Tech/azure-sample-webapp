// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { SCENARIO_RUN_ACTIONS } from '../../commons/ScenarioRunConstants';

export const dispatchFetchScenarioRunById = (organizationId, scenarioRunId) => ({
  type: SCENARIO_RUN_ACTIONS.FETCH,
  organizationId,
  scenarioRunId,
});

export const dispatchStopScenarioRun = (organizationId, scenarioRunId, scenarioId) => ({
  type: SCENARIO_RUN_ACTIONS.STOP_SCENARIO_RUN,
  organizationId,
  scenarioRunId,
  scenarioId,
});
