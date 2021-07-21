// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { takeEvery, call, put } from 'redux-saga/effects';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { STATUSES } from '../../../commons/Constants';
import { SCENARIO_RUN_STATE, ScenarioRunUtils } from '@cosmotech/core';
import { ORGANIZATION_ID } from '../../../../configs/App.config';
import ScenarioRunService from '../../../../services/scenarioRun/ScenarioRunService';
import { ScenarioApi } from '../../../../services/ServiceCommons';

// generators function
export function * updateAndLaunchScenario (action) {
  const workspaceId = action.workspaceId;
  const scenarioId = action.scenarioId;
  const scenarioParameters = action.scenarioParameters;
  // Update scenario parameters
  yield put({
    type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
    data: {
      status: STATUSES.SAVING,
      scenario: { state: SCENARIO_RUN_STATE.RUNNING }
    }
  });

  try {
    const scenario = yield call(
      [ScenarioApi, 'updateScenario'], ORGANIZATION_ID, workspaceId,
      scenarioId, scenarioParameters);
    scenario.parametersValues = ScenarioRunUtils.formatParametersFromApi(scenario.parametersValues);

    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      data: {
        status: STATUSES.IDLE,
        scenario: { state: SCENARIO_RUN_STATE.RUNNING, parametersValues: scenario.parametersValues }
      }
    });
    // Launch scenario if parameters update succeeded
    yield call(ScenarioRunService.runScenario, ORGANIZATION_ID, workspaceId, scenarioId);
    // Start backend polling to update the scenario status
    yield put({
      type: SCENARIO_ACTIONS_KEY.START_SCENARIO_STATUS_POLLING,
      workspaceId: workspaceId,
      scenarioId: scenarioId
    });
  } catch (e) {
    console.error('Failed to update scenario parameters');
    console.error(e);
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      data: { status: STATUSES.ERROR }
    });
  }
}

// generators function
// Here is a watcher that takes EVERY action dispatched named CREATE_SCENARIO
// and binds updateAndLaunchScenario saga to it
function * updateAndLaunchScenarioSaga () {
  yield takeEvery(SCENARIO_ACTIONS_KEY.UPDATE_AND_LAUNCH_SCENARIO,
    updateAndLaunchScenario);
}

export default updateAndLaunchScenarioSaga;
