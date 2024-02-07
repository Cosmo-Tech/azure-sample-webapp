// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { put, select, takeEvery, call } from 'redux-saga/effects';
import { AppInsights } from '../../../../services/AppInsights';
import { Api } from '../../../../services/config/Api';
import { ApiUtils, ScenariosUtils } from '../../../../utils';
import { STATUSES } from '../../../commons/Constants';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';
import { getAllScenariosData } from '../FindAllScenarios/FindAllScenariosData';

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

    const organizationId = action.organizationId;
    const workspaceId = action.workspaceId;
    const security = {
      default: 'none',
      accessControlList: [{ id: userEmail, role: 'admin' }],
    };
    const scenarioPayload = { ...action.scenario, security };
    const { data } = yield call(Api.Scenarios.createScenario, organizationId, workspaceId, scenarioPayload);
    data.parametersValues = ApiUtils.formatParametersFromApi(data.parametersValues);
    ScenariosUtils.patchScenarioWithCurrentUserPermissions(data, userEmail, userId, scenariosPermissionsMapping);
    yield call(getAllScenariosData, organizationId, workspaceId);
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      status: STATUSES.SUCCESS,
      scenario: data,
    });
  } catch (error) {
    console.error(error);
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
