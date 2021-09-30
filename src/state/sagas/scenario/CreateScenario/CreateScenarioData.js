// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { put, takeEvery, call } from 'redux-saga/effects';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { STATUSES } from '../../../commons/Constants';
import { ORGANIZATION_ID } from '../../../../config/AppInstance';
import { getAllScenariosData } from '../FindAllScenarios/FindAllScenariosData';
import { Api } from '../../../../services/config/Api';
import { formatParametersFromApi } from '../../../../utils/ApiUtils';
import { AppInsights } from '../../../../services/AppInsights';

const appInsights = AppInsights.getInstance();

export function * createScenario (action) {
  try {
    appInsights.trackScenarioCreation();
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      status: STATUSES.LOADING
    });
    const workspaceId = action.workspaceId;
    const { data } = yield call(Api.Scenarios.createScenario, ORGANIZATION_ID, workspaceId, action.scenario);
    data.parametersValues = formatParametersFromApi(data.parametersValues);
    yield call(getAllScenariosData, workspaceId);
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      status: STATUSES.SUCCESS,
      scenario: data
    });
  } catch (e) {
    // TODO handle error management
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      status: STATUSES.ERROR,
      scenario: null
    });
  }
}

function * createScenarioData () {
  yield takeEvery(SCENARIO_ACTIONS_KEY.CREATE_SCENARIO, createScenario);
}

export default createScenarioData;
