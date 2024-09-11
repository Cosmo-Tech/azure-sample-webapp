// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { takeEvery, call, put } from 'redux-saga/effects';
import { Api } from '../../../../services/config/Api';
import { RUNNER_RUN_STATE } from '../../../../services/config/ApiConstants';
import { STATUSES } from '../../../commons/Constants';
import { RUNNER_ACTIONS_KEY } from '../../../commons/RunnerConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';
import { stopSimulationRunner } from '../StopSimulationRunner/StopSimulationRunner';

export function* deleteRunner(action) {
  try {
    const organizationId = action.organizationId;
    const workspaceId = action.workspaceId;
    const runnerId = action.runnerId;

    yield put({
      type: RUNNER_ACTIONS_KEY.SET_LIST_STATUS,
      status: STATUSES.LOADING,
    });

    const response = yield call(Api.Runners.getRunner, organizationId, workspaceId, runnerId);
    const lastRunId = response.data?.lastRunId;

    if (lastRunId) {
      const response = yield call(Api.RunnerRuns.getRunStatus, organizationId, workspaceId, runnerId, lastRunId);
      if (response.data.state === RUNNER_RUN_STATE.RUNNING) {
        yield call(stopSimulationRunner, action);
        yield put({
          type: RUNNER_ACTIONS_KEY.STOP_RUNNER_STATUS_POLLING + '_' + runnerId,
          data: { runnerId },
        });
      }
    }

    yield call(Api.Runners.deleteRunner, organizationId, workspaceId, runnerId);
    yield put({
      type: RUNNER_ACTIONS_KEY.SET_LIST_STATUS,
      status: STATUSES.IDLE,
    });

    yield put({
      type: RUNNER_ACTIONS_KEY.DELETE_RUNNER,
      runnerId,
    });
  } catch (error) {
    yield put(
      dispatchSetApplicationErrorMessage(error, t('commoncomponents.banner.delete', "Scenario hasn't been deleted."))
    );
  }
}

function* deleteRunnerSaga() {
  yield takeEvery(RUNNER_ACTIONS_KEY.TRIGGER_SAGA_DELETE_RUNNER, deleteRunner);
}

export default deleteRunnerSaga;
