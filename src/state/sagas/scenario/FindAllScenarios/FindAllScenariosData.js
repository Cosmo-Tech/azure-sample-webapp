// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { call, put, select, takeEvery } from 'redux-saga/effects';
import { Api } from '../../../../services/config/Api';
import { ACL_PERMISSIONS } from '../../../../services/config/accessControl/Permissions';
import { ApiUtils, ScenariosUtils } from '../../../../utils';
import { STATUSES } from '../../../commons/Constants';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';

const getUserEmail = (state) => state.auth.userEmail;
const getUserId = (state) => state.auth.userId;
const getScenariosPermissionsMapping = (state) => state.application.permissionsMapping.scenario;
const getSolutionParameters = (state) => state.solution?.current?.data?.parameters;

const keepOnlyReadableScenarios = (scenarios) =>
  scenarios.filter((scenario) => scenario.security.currentUserPermissions.includes(ACL_PERMISSIONS.SCENARIO.READ));

export function* getAllScenariosData(organizationId, workspaceId) {
  const userEmail = yield select(getUserEmail);
  const userId = yield select(getUserId);
  const scenariosPermissionsMapping = yield select(getScenariosPermissionsMapping);
  const solutionParameters = yield select(getSolutionParameters);
  const { data } = yield call(Api.Scenarios.findAllScenarios, organizationId, workspaceId);

  data.forEach((scenario) =>
    ScenariosUtils.patchScenarioParameterValues(solutionParameters, scenario.parametersValues)
  );
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

function* findAllScenariosData() {
  yield takeEvery(SCENARIO_ACTIONS_KEY.GET_ALL_SCENARIOS, getAllScenariosData);
}

export default findAllScenariosData;
