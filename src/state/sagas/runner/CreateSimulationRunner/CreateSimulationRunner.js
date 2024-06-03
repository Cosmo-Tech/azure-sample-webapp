// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import { AppInsights } from '../../../../services/AppInsights';
import { Api } from '../../../../services/config/Api';
import { RUNNER_RUN_STATE } from '../../../../services/config/ApiConstants';
import { ApiUtils, RunnersUtils } from '../../../../utils';
import { STATUSES } from '../../../commons/Constants';
import { RUNNER_ACTIONS_KEY } from '../../../commons/RunnerConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

const appInsights = AppInsights.getInstance();
const getUserEmail = (state) => state.auth.userEmail;
const getUserId = (state) => state.auth.userId;
const getRunnerPermissionsMapping = (state) => state.application.permissionsMapping.runner;

export function* createSimulationRunner(action) {
  try {
    appInsights.trackScenarioCreation();
    const userEmail = yield select(getUserEmail);
    const userId = yield select(getUserId);
    const runnersPermissionsMapping = yield select(getRunnerPermissionsMapping);

    yield put({
      type: RUNNER_ACTIONS_KEY.SET_CURRENT_SIMULATION_RUNNER,
      status: STATUSES.LOADING,
    });

    const organizationId = action.organizationId;
    const workspaceId = action.workspaceId;
    const runner = action.runner;
    const security = {
      default: 'none',
      accessControlList: [{ id: userEmail, role: 'admin' }],
    };
    const runnerPayload = { ...runner, security };
    const { data } = yield call(Api.Runners.createRunner, organizationId, workspaceId, runnerPayload);
    data.parametersValues = ApiUtils.formatParametersFromApi(data.parametersValues);
    data.state = RUNNER_RUN_STATE.CREATED;
    RunnersUtils.patchRunnerWithCurrentUserPermissions(data, userEmail, userId, runnersPermissionsMapping);
    yield put({
      type: RUNNER_ACTIONS_KEY.ADD_RUNNER,
      data,
    });
    yield put({
      type: RUNNER_ACTIONS_KEY.SET_CURRENT_SIMULATION_RUNNER,
      status: STATUSES.SUCCESS,
      runnerId: data.id,
    });
  } catch (error) {
    console.error(error);
    yield put(
      dispatchSetApplicationErrorMessage(error, t('commoncomponents.banner.create', "Scenario hasn't been created."))
    );
    yield put({
      type: RUNNER_ACTIONS_KEY.SET_CURRENT_SIMULATION_RUNNER,
      status: STATUSES.ERROR,
      runner: null,
    });
  }
}

function* createSimulationRunnerSaga() {
  yield takeEvery(RUNNER_ACTIONS_KEY.TRIGGER_SAGA_CREATE_SIMULATION_RUNNER, createSimulationRunner);
}

export default createSimulationRunnerSaga;
