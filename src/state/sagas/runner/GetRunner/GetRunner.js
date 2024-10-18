// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import { Api } from '../../../../services/config/Api';
import { RUNNER_RUN_STATE } from '../../../../services/config/ApiConstants';
import { ACL_PERMISSIONS } from '../../../../services/config/accessControl';
import { ApiUtils, RunnersUtils } from '../../../../utils';
import { STATUSES } from '../../../commons/Constants';
import { RUNNER_ACTIONS_KEY } from '../../../commons/RunnerConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

const getUserEmail = (state) => state.auth.userEmail;
const getUserId = (state) => state.auth.userId;
const getRunnersPermissionsMapping = (state) => state.application.permissionsMapping.runner;
const getSolutionParameters = (state) => state.solution?.current?.data?.parameters;

export function* getRunner(action) {
  try {
    const userEmail = yield select(getUserEmail);
    const userId = yield select(getUserId);
    const runnersPermissionsMapping = yield select(getRunnersPermissionsMapping);
    const solutionParameters = yield select(getSolutionParameters);
    const organizationId = action.organizationId;
    const workspaceId = action.workspaceId;
    const runnerId = action.runnerId;

    yield put({
      type: RUNNER_ACTIONS_KEY.SET_CURRENT_SIMULATION_RUNNER,
      status: STATUSES.LOADING,
    });

    const { data } = yield call(Api.Runners.getRunner, organizationId, workspaceId, runnerId);
    if (data.lastRunId) {
      try {
        const response = yield call(Api.RunnerRuns.getRunStatus, organizationId, workspaceId, runnerId, data.lastRunId);
        data.state = response.data.state;
      } catch (error) {
        console.error(error);
        yield put(
          dispatchSetApplicationErrorMessage(
            error,
            t(
              'views.scenario.scenarioRunStatusQueryError.comment',
              'Could not get status of scenario run with id "{{id}}".',
              {
                id: data.lastRunId,
              }
            )
          )
        );
        data.state = RUNNER_RUN_STATE.UNKNOWN;
      }
    } else {
      data.state = RUNNER_RUN_STATE.CREATED;
    }
    RunnersUtils.patchRunnerParameterValues(solutionParameters, data.parametersValues);
    data.parametersValues = ApiUtils.formatParametersFromApi(data.parametersValues);

    RunnersUtils.patchRunnerWithCurrentUserPermissions(data, userEmail, userId, runnersPermissionsMapping);

    if (!data.security.currentUserPermissions.includes(ACL_PERMISSIONS.RUNNER.READ)) {
      const err = new Error(t('commoncomponents.banner.openScenario', "Scenario can't be opened"));
      err.detail = t(
        'commoncomponents.banner.noPermissionDetail',
        // eslint-disable-next-line max-len
        "You don't have permission to access the scenario #{{scenarioId}} from workspace #{{workspaceId}} of organization #{{organizationId}}",
        action
      );
      throw err;
    }

    yield put({
      type: RUNNER_ACTIONS_KEY.SET_CURRENT_SIMULATION_RUNNER,
      status: STATUSES.SUCCESS,
      runnerId: data.id,
    });
    yield put({
      type: RUNNER_ACTIONS_KEY.SET_RUNNER_VALIDATION_STATUS,
      status: STATUSES.SUCCESS,
      runnerId: data.id,
      validationStatus: data.validationStatus,
    });
    // Start state polling for running scenarios
    if (data.state === RUNNER_RUN_STATE.RUNNING) {
      yield put({
        type: RUNNER_ACTIONS_KEY.TRIGGER_SAGA_START_RUNNER_STATUS_POLLING,
        organizationId: action.organizationId,
        workspaceId: action.workspaceId,
        runnerId: data.id,
        lastRunId: data.lastRunId,
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
      type: RUNNER_ACTIONS_KEY.SET_CURRENT_SIMULATION_RUNNER,
      status: STATUSES.SUCCESS,
    });
  }
}

function* getRunnerSaga() {
  yield takeEvery(RUNNER_ACTIONS_KEY.TRIGGER_SAGA_GET_RUNNER, getRunner);
}

export default getRunnerSaga;
