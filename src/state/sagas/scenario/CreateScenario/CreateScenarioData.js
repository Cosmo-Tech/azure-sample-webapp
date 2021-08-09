// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { put, takeEvery, call } from 'redux-saga/effects';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { STATUSES } from '../../../commons/Constants';
import { ORGANIZATION_ID } from '../../../../configs/App.config';
import ScenarioService from '../../../../services/scenario/ScenarioService';
import { getAllScenariosData } from '../FindAllScenarios/FindAllScenariosData';

export function * createScenario (action) {
  yield put({
    type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
    data: { status: STATUSES.LOADING }
  });
  const workspaceId = action.workspaceId;
  const { error, data } = yield call(ScenarioService.createScenario, ORGANIZATION_ID, workspaceId, action.scenario);
  if (error) {
    // TODO handle error management
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      data: { status: STATUSES.ERROR }
    });
  } else {
    yield call(getAllScenariosData, workspaceId);
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      data: { status: STATUSES.IDLE, scenario: data }
    });
  }
}

function * createScenarioData () {
  yield takeEvery(SCENARIO_ACTIONS_KEY.CREATE_SCENARIO, createScenario);
}

export default createScenarioData;
