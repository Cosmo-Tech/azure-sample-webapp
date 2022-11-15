// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { call, put, select, takeEvery } from 'redux-saga/effects';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { ORGANIZATION_ID } from '../../../../config/GlobalConfiguration';
import { Api } from '../../../../services/config/Api';
import { STATUSES } from '../../../commons/Constants';
import { ApiUtils, ScenariosUtils } from '../../../../utils';
import { ACL_PERMISSIONS } from '../../../../services/config/accessControl/Permissions';

const getUserEmail = (state) => state.auth.userEmail;
const getUserId = (state) => state.auth.userId;
const getScenariosPermissionsMapping = (state) => state.application.permissionsMapping.scenario;

const keepOnlyReadableScenarios = (scenarios) =>
  scenarios.filter((scenario) => scenario.security.currentUserPermissions.includes(ACL_PERMISSIONS.SCENARIO.READ));

// generators function
export function* getAllScenariosData(workspaceId) {
  // yield keyword is here to milestone and save the action
  const userEmail = yield select(getUserEmail);
  const userId = yield select(getUserId);
  const scenariosPermissionsMapping = yield select(getScenariosPermissionsMapping);
  const { data } = yield call(Api.Scenarios.findAllScenarios, ORGANIZATION_ID, workspaceId);
  data.forEach((scenario) => (scenario.parametersValues = ApiUtils.formatParametersFromApi(scenario.parametersValues)));
  data.forEach((scenario) =>
    ScenariosUtils.patchScenarioWithCurrentUserPermissions(scenario, userEmail, userId, scenariosPermissionsMapping)
  );

  yield put({
    type: SCENARIO_ACTIONS_KEY.SET_ALL_SCENARIOS,
    list: keepOnlyReadableScenarios(data),
    status: STATUSES.SUCCESS,
  });
}

// generators function
// Here is a watcher that takes EVERY action dispatched named GET_ALL_SCENARIOS and binds getAllScenariosData saga to it
function* findAllScenariosData() {
  yield takeEvery(SCENARIO_ACTIONS_KEY.GET_ALL_SCENARIOS, getAllScenariosData);
}

export default findAllScenariosData;
