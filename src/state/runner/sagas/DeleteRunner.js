// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { takeEvery, call, put } from 'redux-saga/effects';
import { Api } from '../../../services/config/Api';
import { RUNNER_RUN_STATE } from '../../../services/config/ApiConstants';
import { STATUSES } from '../../../services/config/StatusConstants';
import { RunnersUtils } from '../../../utils';
import { setApplicationErrorMessage } from '../../app/reducers';
import { RUNNER_ACTIONS_KEY } from '../constants';
import { deleteRunner, setListStatus } from '../reducers';
import { stopSimulationRunner } from './StopSimulationRunner';

export function* callDeleteRunner(action) {
  try {
    const organizationId = action.organizationId;
    const workspaceId = action.workspaceId;
    const runnerId = action.runnerId;

    yield put(
      setListStatus({
        status: STATUSES.LOADING,
      })
    );

    const response = yield call(Api.Runners.getRunner, organizationId, workspaceId, runnerId);
    const lastRunId = RunnersUtils.getLastRunId(response.data);

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
    yield put(
      setListStatus({
        status: STATUSES.IDLE,
      })
    );

    yield put(
      deleteRunner({
        runnerId,
      })
    );
  } catch (error) {
    yield put(
      setListStatus({
        status: STATUSES.IDLE,
      })
    );
    yield put(
      setApplicationErrorMessage({
        error,
        errorMessage: t('commoncomponents.banner.delete', "Scenario hasn't been deleted."),
      })
    );
  }
}

function* deleteRunnerSaga() {
  yield takeEvery(RUNNER_ACTIONS_KEY.DELETE_RUNNER, callDeleteRunner);
}

export default deleteRunnerSaga;
