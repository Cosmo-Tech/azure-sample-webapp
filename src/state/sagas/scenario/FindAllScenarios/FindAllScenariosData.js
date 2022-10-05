// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { call, put, select, takeEvery } from 'redux-saga/effects';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { ORGANIZATION_ID } from '../../../../config/GlobalConfiguration';
import { Api } from '../../../../services/config/Api';
import { STATUSES } from '../../../commons/Constants';
import { formatParametersFromApi } from '../../../../utils/ApiUtils';
import { ACL_ROLES } from '../../../../services/config/accessControl';
import { ScenariosUtils } from '../../../../utils';

const getUserEmail = (state) => state.auth.userEmail;
const getUserId = (state) => state.auth.userId;

// TODO: Remove hard-coded values before mergiing branch
// vvvvvvvvv CODE TO REMOVE vvvvvvvvvvvvvvvv
const USERS_EMAILS = ['alice@example.com', 'bob@example.com'];
const FAKE_SECURITY_DATA_EMPTY = { default: null, accessControlList: [] };
const FAKE_SECURITY_DATA_DEFAULT_READ_ONLY = {
  default: ACL_ROLES.SCENARIO.READER,
  accessControlList: [],
};
const FAKE_SECURITY_DATA_SPECIFIC_WRITERS = {
  default: ACL_ROLES.SCENARIO.READER,
  accessControlList: USERS_EMAILS.map((email) => ({
    id: email,
    role: ACL_ROLES.SCENARIO.WRITER,
  })),
};
const FAKE_SECURITY_DATA_SPECIFIC_VALIDATORS = {
  default: ACL_ROLES.SCENARIO.READER,
  accessControlList: USERS_EMAILS.map((email) => ({
    id: email,
    role: ACL_ROLES.SCENARIO.VALIDATOR,
  })),
};
const FAKE_SECURITY_DATA_SPECIFIC_ADMINS = {
  default: ACL_ROLES.SCENARIO.READER,
  accessControlList: USERS_EMAILS.map((email) => ({
    id: email,
    role: ACL_ROLES.SCENARIO.ADMIN,
  })),
};
const FAKE_SECURITY_DATA_ARRAY = [
  FAKE_SECURITY_DATA_EMPTY,
  FAKE_SECURITY_DATA_DEFAULT_READ_ONLY,
  FAKE_SECURITY_DATA_SPECIFIC_WRITERS,
  FAKE_SECURITY_DATA_SPECIFIC_VALIDATORS,
  FAKE_SECURITY_DATA_SPECIFIC_ADMINS,
];
const devPatchScenarioWithFakeSecurityData = (scenario) => {
  const number = Number(scenario.id.match(/\d+/)?.[0] || '0');
  const fakeSecurityData = FAKE_SECURITY_DATA_ARRAY[(number + 1) % 5];
  scenario.security = {
    ...scenario.security,
    ...fakeSecurityData,
  };
};
// ^^^^^^^^^^ CODE TO REMOVE ^^^^^^^^^^

// generators function
export function* getAllScenariosData(workspaceId) {
  // yield keyword is here to milestone and save the action
  const userEmail = yield select(getUserEmail);
  const userId = yield select(getUserId);
  const { data } = yield call(Api.Scenarios.findAllScenarios, ORGANIZATION_ID, workspaceId);
  data.forEach((scenario) => (scenario.parametersValues = formatParametersFromApi(scenario.parametersValues)));
  data.forEach((scenario) => devPatchScenarioWithFakeSecurityData(scenario));
  data.forEach((scenario) => ScenariosUtils.patchScenarioWithCurrentUserPermissions(scenario, userEmail, userId));
  yield put({
    type: SCENARIO_ACTIONS_KEY.SET_ALL_SCENARIOS,
    list: data,
    status: STATUSES.SUCCESS,
  });
}

// generators function
// Here is a watcher that takes EVERY action dispatched named GET_ALL_SCENARIOS and binds getAllScenariosData saga to it
function* findAllScenariosData() {
  yield takeEvery(SCENARIO_ACTIONS_KEY.GET_ALL_SCENARIOS, getAllScenariosData);
}

export default findAllScenariosData;
