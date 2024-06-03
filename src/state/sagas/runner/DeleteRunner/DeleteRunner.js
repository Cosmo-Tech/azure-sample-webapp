// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { takeEvery, call, put } from 'redux-saga/effects';
import { Api } from '../../../../services/config/Api';
import { RUNNER_RUN_STATE } from '../../../../services/config/ApiConstants';
import { RUNNER_ACTIONS_KEY } from '../../../commons/RunnerConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';
import { stopRunner } from '../StopRunner/StopRunner';

export function* deleteRunner(action) {
  try {
    const organizationId = action.organizationId;
    const workspaceId = action.workspaceId;
    const runnerId = action.runnerId;

    const response = yield call(Api.Runners.getRunner, organizationId, workspaceId, runnerId);
    action.lastRunId = response.data?.lastRunId;

    if (response.data.state === RUNNER_RUN_STATE.RUNNING) {
      yield call(stopRunner, action);
    }

    yield call(Api.Runners.deleteRunner, organizationId, workspaceId, runnerId);

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
