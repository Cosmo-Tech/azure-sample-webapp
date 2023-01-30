// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { call, put, take, takeEvery, delay, race } from 'redux-saga/effects';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { Api } from '../../../../services/config/Api';
import { SCENARIO_STATUS_POLLING_DELAY } from '../../../../services/config/FunctionalConstants';
import { AppInsights } from '../../../../services/AppInsights';
import { STATUSES } from '../../../commons/Constants';
import { t } from 'i18next';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';
import { SCENARIO_RUN_STATE } from '../../../../services/config/ApiConstants';

const appInsights = AppInsights.getInstance();

function forgeStopPollingAction(scenarioId) {
  let actionName = SCENARIO_ACTIONS_KEY.STOP_SCENARIO_STATUS_POLLING;
  actionName += '_' + scenarioId;
  return { type: actionName, data: { scenarioId } };
}

// generators function
export function* pollScenarioState(action) {
  // Loop until the scenario state is FAILED or SUCCESS
  while (true) {
    try {
      // Fetch data of the scenario with the provided id
      const response = yield call(
        Api.Scenarios.findScenarioById,
        action.organizationId,
        action.workspaceId,
        action.scenarioId
      );

      const data = response.data;
      if (data.state === 'Failed' || data.state === 'Successful') {
        // Update the scenario state in all scenario redux states
        yield put({
          type: SCENARIO_ACTIONS_KEY.UPDATE_SCENARIO,
          data: {
            scenarioState: data.state,
            scenarioId: action.scenarioId,
            lastRun: data.lastRun,
          },
        });
        if (action.startTime) {
          const runFinishTime = new Date().getTime();
          const runDuration = (runFinishTime - action.startTime) / 1000;
          appInsights.trackScenarioRunDuration(runDuration);
        }
        // Stop the polling for this scenario
        yield put(forgeStopPollingAction(action.scenarioId));
      }
      // Wait before retrying
      yield delay(SCENARIO_STATUS_POLLING_DELAY);
    } catch (error) {
      console.error(error);
      yield put(
        dispatchSetApplicationErrorMessage(
          error,
          t('commoncomponents.banner.run', 'A problem occurred during the scenario run.')
        )
      );
      yield put({
        type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
        status: STATUSES.ERROR,
        scenario: { state: SCENARIO_RUN_STATE.FAILED },
      });
      // Stop the polling for this scenario
      yield put(forgeStopPollingAction(action.scenarioId));
    }
  }
}

function* startPolling(action) {
  let stopActionName = SCENARIO_ACTIONS_KEY.STOP_SCENARIO_STATUS_POLLING;
  stopActionName += '_' + action.scenarioId;
  yield race([call(pollScenarioState, action), take(stopActionName)]);
}

function* pollScenarioStateSaga() {
  // Call startPolling to get the action parameters (we need the scenario id)
  yield takeEvery(SCENARIO_ACTIONS_KEY.START_SCENARIO_STATUS_POLLING, startPolling);
}

export default pollScenarioStateSaga;
