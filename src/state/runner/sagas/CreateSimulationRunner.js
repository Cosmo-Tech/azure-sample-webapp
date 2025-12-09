// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import { Api } from '../../../services/config/Api';
import { STATUSES } from '../../../services/config/StatusConstants';
import { ApiUtils, RunnersUtils } from '../../../utils';
import { setApplicationErrorMessage } from '../../app/reducers';
import { RUNNER_ACTIONS_KEY } from '../constants';
import { addSimulationRunner, setCurrentSimulationRunner } from '../reducers';

const getUserEmail = (state) => state.auth.userEmail;
const getUserName = (state) => state.auth.userName;
const getUserId = (state) => state.auth.userId;
const getRunnerPermissionsMapping = (state) => state.application.permissionsMapping.runner;

export function* createSimulationRunner(action) {
  try {
    yield put(setCurrentSimulationRunner({ status: STATUSES.LOADING }));

    const userEmail = yield select(getUserEmail);
    const ownerName = yield select(getUserName);
    const userId = yield select(getUserId);
    const runnersPermissionsMapping = yield select(getRunnerPermissionsMapping);
    const organizationId = action.organizationId;
    const workspaceId = action.workspaceId;
    const runner = action.runner;
    const security = { default: 'none', accessControlList: [{ id: userEmail, role: 'admin' }] };
    const runnerPayload = { ...runner, security };
    RunnersUtils.setRunnerOptions(runnerPayload, { ownerName });

    const { data } = yield call(Api.Runners.createRunner, organizationId, workspaceId, runnerPayload);
    data.parametersValues = ApiUtils.formatParametersFromApi(data.parametersValues);
    RunnersUtils.patchRunnerWithCurrentUserPermissions(data, userEmail, userId, runnersPermissionsMapping);

    yield put(addSimulationRunner({ data }));
    yield put(setCurrentSimulationRunner({ status: STATUSES.SUCCESS, runnerId: data.id }));
  } catch (error) {
    console.error(error);
    const errorMessage = t('commoncomponents.banner.create', "Scenario hasn't been created.");
    yield put(setApplicationErrorMessage({ error, errorMessage }));
    yield put(setCurrentSimulationRunner({ status: STATUSES.ERROR, runner: null }));
  }
}

function* createSimulationRunnerSaga() {
  yield takeEvery(RUNNER_ACTIONS_KEY.CREATE_SIMULATION_RUNNER, createSimulationRunner);
}

export default createSimulationRunnerSaga;
