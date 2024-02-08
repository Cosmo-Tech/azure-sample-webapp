// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { call, put, takeEvery } from 'redux-saga/effects';
import { Api } from '../../../../services/config/Api';
import { SCENARIO_RUN_STATE } from '../../../../services/config/ApiConstants';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { SCENARIO_RUN_ACTIONS } from '../../../commons/ScenarioRunConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

// generators function
export function* stopScenarioRun(action) {
  try {
    yield call(Api.ScenarioRuns.stopScenarioRun, action.organizationId, action.scenarioRunId);
    yield put({
      type: SCENARIO_ACTIONS_KEY.UPDATE_SCENARIO,
      data: { scenarioState: SCENARIO_RUN_STATE.FAILED, scenarioId: action.scenarioId },
    });
    yield put({
      type: `${SCENARIO_ACTIONS_KEY.STOP_SCENARIO_STATUS_POLLING}_${action.scenarioId}`,
      data: { scenarioId: action.scenarioId },
    });
  } catch (error) {
    console.error(error);
    yield put(
      dispatchSetApplicationErrorMessage(
        error,
        t('views.scenario.scenarioRunStopError.comment', 'Could not stop scenario run with id "{{id}}".', {
          id: action.scenarioRunId,
        })
      )
    );
  }
}
// generators function
// Here is a watcher that takes EVERY action dispatched named STOP_SCENARIO_RUN
// and binds stopScenarioRun saga to it
function* stopScenarioRunSaga() {
  yield takeEvery(SCENARIO_RUN_ACTIONS.STOP_SCENARIO_RUN, stopScenarioRun);
}
export default stopScenarioRunSaga;
