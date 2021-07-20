// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { call, put, take, takeEvery, delay, race } from 'redux-saga/effects';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { ORGANIZATION_ID } from '../../../../configs/App.config';
import API_CONFIG from '../../../../configs/Api.config';
import ScenarioService from '../../../../services/scenario/ScenarioService';

function forgeStopPollingAction (scenarioId) {
  let actionName = SCENARIO_ACTIONS_KEY.STOP_SCENARIO_STATUS_POLLING;
  actionName += '_' + scenarioId;
  return { type: actionName, data: { scenarioId: scenarioId } };
}

// generators function
export function * pollScenarioState (action) {
  // Loop until the scenario state is FAILED or SUCCESS
  while (true) {
    try {
      // Fetch data of the scenario with the provided id
      const scenario = yield call(
        ScenarioService.findScenarioById,
        ORGANIZATION_ID,
        action.workspaceId,
        action.scenarioId);
      if (scenario.state === 'Failed' || scenario.state === 'Successful') {
        // Update the scenario state in all scenario redux states
        yield put({
          type: SCENARIO_ACTIONS_KEY.UPDATE_SCENARIO,
          data: { scenarioState: scenario.state, scenarioId: action.scenarioId, lastRun: scenario.lastRun }
        });
        // Stop the polling for this scenario
        yield put(forgeStopPollingAction(action.scenarioId));
      }
      // Wait before retrying
      yield delay(API_CONFIG.scenarioStatusPollingDelay);
    } catch (err) {
      console.error(err); // Log error and keep trying
    }
  }
}

function * startPolling (action) {
  let stopActionName = SCENARIO_ACTIONS_KEY.STOP_SCENARIO_STATUS_POLLING;
  stopActionName += '_' + action.scenarioId;
  yield race([call(pollScenarioState, action), take(stopActionName)]);
}

function * pollScenarioStateSaga () {
  // Call startPolling to get the action parameters (we need the scenario id)
  yield takeEvery(SCENARIO_ACTIONS_KEY.START_SCENARIO_STATUS_POLLING, startPolling);
}

export default pollScenarioStateSaga;
