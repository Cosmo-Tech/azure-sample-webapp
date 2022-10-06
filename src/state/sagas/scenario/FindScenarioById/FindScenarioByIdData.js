// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { call, put, select, takeEvery } from 'redux-saga/effects';
import { SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants';
import { STATUSES } from '../../../commons/Constants';
import { ORGANIZATION_ID } from '../../../../config/GlobalConfiguration';
import { formatParametersFromApi } from '../../../../utils/ApiUtils';
import { ScenariosUtils } from '../../../../utils';
import { SCENARIO_RUN_STATE } from '../../../../services/config/ApiConstants';
import { ACL_ROLES } from '../../../../services/config/accessControl';
import { Api } from '../../../../services/config/Api';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';
import { t } from 'i18next';

// TODO: confirm if roles are stored by id or by email
const getUserEmail = (state) => state.auth.userEmail;
const getUserId = (state) => state.auth.userId;

// TODO: Remove hard-coded values before merging branch
// vvvvvvvvv CODE TO REMOVE vvvvvvvvvvvvvvvv
const USERS_EMAILS = ['zzz@example.com', 'alice@example.com', 'bob@example.com'];
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

export function* fetchScenarioByIdData(action) {
  try {
    const userEmail = yield select(getUserEmail);
    const userId = yield select(getUserId);
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      status: STATUSES.LOADING,
    });

    const { data } = yield call(Api.Scenarios.findScenarioById, ORGANIZATION_ID, action.workspaceId, action.scenarioId);
    data.parametersValues = formatParametersFromApi(data.parametersValues);
    devPatchScenarioWithFakeSecurityData(data);
    ScenariosUtils.patchScenarioWithCurrentUserPermissions(data, userEmail, userId);
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_SCENARIO_VALIDATION_STATUS,
      status: STATUSES.SUCCESS,
      scenarioId: data.id,
      validationStatus: data.validationStatus,
    });
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      status: STATUSES.SUCCESS,
      scenario: data,
    });

    // Start state polling for running scenarios
    if (data.state === SCENARIO_RUN_STATE.RUNNING) {
      yield put({
        type: SCENARIO_ACTIONS_KEY.START_SCENARIO_STATUS_POLLING,
        workspaceId: action.workspaceId,
        scenarioId: data.id,
      });
    }
  } catch (error) {
    yield put(
      dispatchSetApplicationErrorMessage(
        error,
        t('views.scenario.redirectError.comment', 'You have been redirected to default Scenario view')
      )
    );
    // Redirection is handled by a useEffect in the Scenario view. For this saga, we can consider that the status is
    // now SUCCESS in the redux state for current scenario
    yield put({
      type: SCENARIO_ACTIONS_KEY.SET_CURRENT_SCENARIO,
      status: STATUSES.SUCCESS,
    });
  }
}

function* findScenarioByIdData() {
  yield takeEvery(SCENARIO_ACTIONS_KEY.FIND_SCENARIO_BY_ID, fetchScenarioByIdData);
}

export default findScenarioByIdData;
