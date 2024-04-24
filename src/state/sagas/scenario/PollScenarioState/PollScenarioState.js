// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { call, put, take, takeEvery, delay, race, select } from 'redux-saga/effects';
import { AppInsights } from '../../../../services/AppInsights';
import { Api } from '../../../../services/config/Api';
import { SCENARIO_RUN_STATE } from '../../../../services/config/ApiConstants';
import { POLLING_START_DELAY, SCENARIO_STATUS_POLLING_DELAY } from '../../../../services/config/FunctionalConstants';
import { STATUSES } from '../../../commons/Constants';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

const appInsights = AppInsights.getInstance();

function forgeStopPollingAction(scenarioId) {
  let actionName = SCENARIO_ACTIONS_KEY.STOP_SCENARIO_STATUS_POLLING;
  actionName += '_' + scenarioId;
  return { type: actionName, data: { scenarioId } };
}

const getCurrentScenarioState = (state) => state.scenario.current?.data?.state;

export function* pollScenarioState(action) {
  // Polling start is delayed to avoid an erroneous Unknown state due to the fact that in first seconds of the run,
  // the AKS container isn't created yet and scenario.state passes to Unknown for a few seconds before returning to
  // Running again.
  // For more details, see https://cosmo-tech.atlassian.net/browse/SDCOSMO-1768
  yield delay(POLLING_START_DELAY);
  // Loop until the scenario state is FAILED, SUCCESS or UNKNOWN
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
      if ([SCENARIO_RUN_STATE.FAILED, SCENARIO_RUN_STATE.SUCCESSFUL, SCENARIO_RUN_STATE.UNKNOWN].includes(data.state)) {
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

      // Update scenario on transition Running -> DataIngestionInProgress
      const currentScenarioState = yield select(getCurrentScenarioState);
      if (currentScenarioState !== data.state) {
        yield put({
          type: SCENARIO_ACTIONS_KEY.UPDATE_SCENARIO,
          data: {
            scenarioState: data.state,
            scenarioId: action.scenarioId,
          },
        });
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

  // Prevent double polling on same scenario
  yield put(forgeStopPollingAction(action.scenarioId));

  yield race([
    call(pollScenarioState, action),
    take([stopActionName, SCENARIO_ACTIONS_KEY.STOP_ALL_SCENARIO_STATUS_POLLINGS]),
  ]);
}

function* pollScenarioStateSaga() {
  // Call startPolling to get the action parameters (we need the scenario id)
  yield takeEvery(SCENARIO_ACTIONS_KEY.START_SCENARIO_STATUS_POLLING, startPolling);
}

export default pollScenarioStateSaga;
