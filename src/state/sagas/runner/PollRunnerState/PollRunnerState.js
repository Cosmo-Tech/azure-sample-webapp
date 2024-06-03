// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { call, put, take, takeEvery, delay, race } from 'redux-saga/effects';
import { AppInsights } from '../../../../services/AppInsights';
import { Api } from '../../../../services/config/Api';
import { RUNNER_RUN_STATE } from '../../../../services/config/ApiConstants';
import { POLLING_START_DELAY, RUNNER_STATUS_POLLING_DELAY } from '../../../../services/config/FunctionalConstants';
import { STATUSES } from '../../../commons/Constants';
import { RUNNER_ACTIONS_KEY } from '../../../commons/RunnerConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

const appInsights = AppInsights.getInstance();

function forgeStopPollingAction(runnerId) {
  let actionName = RUNNER_ACTIONS_KEY.STOP_RUNNER_STATUS_POLLING;
  actionName += '_' + runnerId;
  return { type: actionName, data: { runnerId } };
}

export function* pollRunnerState(action) {
  // Polling start is delayed to avoid an erroneous Unknown state due to the fact that in first seconds of the run,
  // the AKS container isn't created yet and runner.state passes to Unknown for a few seconds before returning to
  // Running again.
  // For more details, see https://cosmo-tech.atlassian.net/browse/SDCOSMO-1768
  yield delay(POLLING_START_DELAY);
  // Loop until the runner state is FAILED, SUCCESS or UNKNOWN
  while (true) {
    try {
      // Fetch data of the scenario with the provided id
      const response = yield call(
        Api.RunnerRuns.getRunStatus,
        action.organizationId,
        action.workspaceId,
        action.runnerId,
        action.runnerRunId
      );

      const data = response.data;
      if ([RUNNER_RUN_STATE.FAILED, RUNNER_RUN_STATE.SUCCESSFUL, RUNNER_RUN_STATE.UNKNOWN].includes(data.state)) {
        // Update the scenario state in all scenario redux states
        const lastRun = {
          runnerRunId: data.id,
        };
        yield put({
          type: RUNNER_ACTIONS_KEY.UPDATE_RUNNER,
          data: {
            runnerState: data.state,
            runnerId: action.runnerId,
            lastRun,
          },
        });
        if (action.startTime) {
          const runFinishTime = new Date().getTime();
          const runDuration = (runFinishTime - action.startTime) / 1000;
          appInsights.trackRunnerRunDuration(runDuration);
        }
        // Stop the polling for this scenario
        yield put(forgeStopPollingAction(action.runnerId));
      }

      // Wait before retrying
      yield delay(RUNNER_STATUS_POLLING_DELAY);
    } catch (error) {
      console.error(error);
      yield put(
        dispatchSetApplicationErrorMessage(
          error,
          t('commoncomponents.banner.run', 'A problem occurred during the scenario run.')
        )
      );
      yield put({
        type: RUNNER_ACTIONS_KEY.SET_CURRENT_SIMULATION_RUNNER,
        status: STATUSES.ERROR,
        scenario: { state: RUNNER_RUN_STATE.FAILED },
      });
      // Stop the polling for this scenario
      yield put(forgeStopPollingAction(action.runnerId));
    }
  }
}

function* startPolling(action) {
  let stopActionName = RUNNER_ACTIONS_KEY.STOP_RUNNER_STATUS_POLLING;
  stopActionName += '_' + action.runnerId;

  // Prevent double polling on same scenario
  yield put(forgeStopPollingAction(action.runnerId));

  yield race([
    call(pollRunnerState, action),
    take([stopActionName, RUNNER_ACTIONS_KEY.STOP_ALL_RUNNERS_STATUS_POLLING]),
  ]);
}

function* pollRunnerStateSaga() {
  yield takeEvery(RUNNER_ACTIONS_KEY.TRIGGER_SAGA_START_RUNNER_STATUS_POLLING, startPolling);
}

export default pollRunnerStateSaga;
