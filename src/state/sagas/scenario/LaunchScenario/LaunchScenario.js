// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { takeEvery, call, put } from 'redux-saga/effects';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { STATUSES } from '../../../commons/Constants';
import { SCENARIO_RUN_STATE } from '../../../../services/config/ApiConstants';
import { Api } from '../../../../services/config/Api';
import { AppInsights } from '../../../../services/AppInsights';
import { t } from 'i18next';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

const appInsights = AppInsights.getInstance();

// generators function
export function* launchScenario(action) {
  try {
    appInsights.trackScenarioLaunch();
    const organizationId = action.organizationId;
    const workspaceId = action.workspaceId;
    const scenarioId = action.scenarioId;
    const runStartTime = new Date().getTime();

    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      scenario: { state: SCENARIO_RUN_STATE.RUNNING },
    });
    yield call(Api.ScenarioRuns.runScenario, organizationId, workspaceId, scenarioId);
    yield put({
      type: SCENARIO_ACTIONS_KEY.UPDATE_SCENARIO,
      data: { scenarioState: SCENARIO_RUN_STATE.RUNNING, scenarioId, lastRun: null },
    });

    // Start backend polling to update the scenario status
    yield put({
      type: SCENARIO_ACTIONS_KEY.START_SCENARIO_STATUS_POLLING,
      organizationId,
      workspaceId,
      scenarioId,
      startTime: runStartTime,
    });
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
  }
}

// generators function
// Here is a watcher that takes EVERY action dispatched named LAUNCH_SCENARIO
// and binds createScenario saga to it
function* launchScenarioSaga() {
  yield takeEvery(SCENARIO_ACTIONS_KEY.LAUNCH_SCENARIO, launchScenario);
}

export default launchScenarioSaga;
