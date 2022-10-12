// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { put, select, takeEvery, call } from 'redux-saga/effects';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { STATUSES } from '../../../commons/Constants';
import { ORGANIZATION_ID } from '../../../../config/GlobalConfiguration';
import { getAllScenariosData } from '../FindAllScenarios/FindAllScenariosData';
import { Api } from '../../../../services/config/Api';
import { formatParametersFromApi } from '../../../../utils/ApiUtils';
import { AppInsights } from '../../../../services/AppInsights';
import { t } from 'i18next';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';
import { ScenariosUtils } from '../../../../utils';

const appInsights = AppInsights.getInstance();
const getUserEmail = (state) => state.auth.userEmail;
const getUserId = (state) => state.auth.userId;
const getScenariosPermissionsMapping = (state) => state.application.permissionsMapping.scenario;

export function* createScenario(action) {
  try {
    appInsights.trackScenarioCreation();
    const userEmail = yield select(getUserEmail);
    const userId = yield select(getUserId);
    const scenariosPermissionsMapping = yield select(getScenariosPermissionsMapping);

    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      status: STATUSES.LOADING,
    });
    const workspaceId = action.workspaceId;
    const { data } = yield call(Api.Scenarios.createScenario, ORGANIZATION_ID, workspaceId, action.scenario);
    data.parametersValues = formatParametersFromApi(data.parametersValues);
    ScenariosUtils.patchScenarioWithCurrentUserPermissions(data, userEmail, userId, scenariosPermissionsMapping);
    yield call(getAllScenariosData, workspaceId);
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      status: STATUSES.SUCCESS,
      scenario: data,
    });
  } catch (error) {
    // TODO handle error management
    yield put(
      dispatchSetApplicationErrorMessage(error, t('commoncomponents.banner.create', "Scenario hasn't been created."))
    );
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      status: STATUSES.ERROR,
      scenario: null,
    });
  }
}

function* createScenarioData() {
  yield takeEvery(SCENARIO_ACTIONS_KEY.CREATE_SCENARIO, createScenario);
}

export default createScenarioData;
