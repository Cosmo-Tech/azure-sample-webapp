// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { call, put, takeEvery } from 'redux-saga/effects';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { STATUSES } from '../../../commons/Constants';
import { ORGANIZATION_ID } from '../../../../config/AppInstance';
import { formatParametersFromApi, SCENARIO_RUN_STATE } from '../../../../utils/ApiUtils';
import { Api } from '../../../../services/config/Api';

export function * fetchScenarioByIdForInitialData (workspaceId, scenarioId) {
  try {
    const { data } = yield call(Api.Scenarios.findScenarioById, ORGANIZATION_ID, workspaceId, scenarioId);
    data.parametersValues = formatParametersFromApi(data.parametersValues);
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      data: { status: STATUSES.IDLE, scenario: data }
    });
  } catch (e) {
    // TODO handle error management
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      data: { status: STATUSES.ERROR }
    });
  }
}

export function * fetchScenarioByIdData (action) {
  try {
    const { data } = yield call(Api.Scenarios.findScenarioById, ORGANIZATION_ID, action.workspaceId, action.scenarioId);
    data.parametersValues = formatParametersFromApi(data.parametersValues);
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      data: { status: STATUSES.IDLE, scenario: data }
    });
    // Start state polling for running scenarios
    if (data.state === SCENARIO_RUN_STATE.RUNNING) {
      yield put({
        type: SCENARIO_ACTIONS_KEY.START_SCENARIO_STATUS_POLLING,
        workspaceId: action.workspaceId,
        scenarioId: data.id
      });
    }
  } catch (e) {
    // TODO handle error management
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      data: { status: STATUSES.ERROR }
    });
  }
}

function * findScenarioByIdData () {
  yield takeEvery(SCENARIO_ACTIONS_KEY.FIND_SCENARIO_BY_ID, fetchScenarioByIdData);
}

export default findScenarioByIdData;
