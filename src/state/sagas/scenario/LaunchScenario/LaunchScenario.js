// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { takeEvery, call, put } from 'redux-saga/effects';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { STATUSES } from '../../../commons/Constants';
import { SCENARIO_RUN_STATE } from '../../../../utils/ApiUtils';
import { ORGANIZATION_ID } from '../../../../config/AppInstance';
import { Api } from '../../../../services/config/Api';
import { AppInsights } from '../../../../services/AppInsights';

const appInsights = AppInsights.getInstance();

// generators function
export function * launchScenario (action) {
  try {
    appInsights.trackScenarioLaunch();
    const workspaceId = action.workspaceId;
    const scenarioId = action.scenarioId;

    // Update scenario
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      status: STATUSES.SAVING,
      scenario: { state: SCENARIO_RUN_STATE.RUNNING }
    });

    // Launch scenario if parameters update succeeded
    yield call(Api.ScenarioRuns.runScenario, ORGANIZATION_ID, workspaceId, scenarioId);

    // Start backend polling to update the scenario status
    yield put({
      type: SCENARIO_ACTIONS_KEY.START_SCENARIO_STATUS_POLLING,
      workspaceId: workspaceId,
      scenarioId: scenarioId
    });
  } catch (e) {
    console.error(e);
  }
}

// generators function
// Here is a watcher that takes EVERY action dispatched named CREATE_SCENARIO
// and binds createScenario saga to it
function * launchScenarioSaga () {
  yield takeEvery(SCENARIO_ACTIONS_KEY.LAUNCH_SCENARIO, launchScenario);
}

export default launchScenarioSaga;
