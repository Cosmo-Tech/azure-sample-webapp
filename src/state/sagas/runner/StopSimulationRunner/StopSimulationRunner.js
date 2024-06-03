// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { call, put, takeEvery } from 'redux-saga/effects';
import { Api } from '../../../../services/config/Api';
import { RUNNER_RUN_STATE } from '../../../../services/config/ApiConstants';
import { RUNNER_ACTIONS_KEY } from '../../../commons/RunnerConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

// generators function
export function* stopSimulationRunner(action) {
  try {
    yield call(Api.Runners.stopRun, action.organizationId, action.workspaceId, action.runnerId);
    yield put({
      type: RUNNER_ACTIONS_KEY.UPDATE_RUNNER,
      runnerId: action.runnerId,
      runner: { state: RUNNER_RUN_STATE.FAILED },
    });
    yield put({
      type: `${RUNNER_ACTIONS_KEY.STOP_RUNNER_STATUS_POLLING}_${action.runnerId}`,
      data: { runnerId: action.runnerId },
    });
  } catch (error) {
    console.error(error);
    yield put(
      dispatchSetApplicationErrorMessage(
        error,
        t('views.scenario.scenarioRunStopError.comment', 'Could not stop scenario with id "{{id}}".', {
          id: action.runnerId,
        })
      )
    );
  }
}
// generators function
// Here is a watcher that takes EVERY action dispatched named STOP_SCENARIO_RUN
// and binds stopScenarioRun saga to it
function* stopSimulationRunnerSaga() {
  yield takeEvery(RUNNER_ACTIONS_KEY.TRIGGER_SAGA_STOP_SIMULATION_RUNNER, stopSimulationRunner);
}
export default stopSimulationRunnerSaga;
