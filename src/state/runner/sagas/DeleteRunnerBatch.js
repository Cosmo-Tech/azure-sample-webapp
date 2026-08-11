// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { takeEvery, call, put, all } from 'redux-saga/effects';
import { Api } from '../../../services/config/Api';
import { RUNNER_RUN_STATE } from '../../../services/config/ApiConstants';
import { STATUSES } from '../../../services/config/StatusConstants';
import { RunnersUtils } from '../../../utils';
import { setApplicationErrorMessage } from '../../app/reducers';
import { RUNNER_ACTIONS_KEY } from '../constants';
import { deleteRunner, setCurrentSimulationRunnerStatus, setListStatus } from '../reducers';
import { stopSimulationRunner } from './StopSimulationRunner';

function* deleteSingleRunner(action, runnerId) {
  const organizationId = action.organizationId;
  const workspaceId = action.workspaceId;

  const { data } = yield call(Api.Runners.getRunner, organizationId, workspaceId, runnerId);
  const lastRunStatus = RunnersUtils.getLastRunStatus(data);
  if (lastRunStatus === RUNNER_RUN_STATE.RUNNING) {
    yield call(stopSimulationRunner, { ...action, runnerId });
  }

  yield call(Api.Runners.deleteRunner, organizationId, workspaceId, runnerId);
  yield put(deleteRunner({ runnerId }));
}

export function* callDeleteRunnerBatch(action) {
  const runnerIds = action.runnerIds;

  try {
    yield put(setListStatus({ status: STATUSES.LOADING }));
    yield put(setCurrentSimulationRunnerStatus({ status: STATUSES.LOADING }));

    const results = yield all(
      runnerIds.map((runnerId) =>
        call(function* () {
          try {
            yield call(deleteSingleRunner, action, runnerId);
            return { runnerId, error: null };
          } catch (error) {
            console.error(`Could not delete runner with id "${runnerId}"`);
            console.error(error);
            return { runnerId, error };
          }
        })
      )
    );

    yield put(setListStatus({ status: STATUSES.IDLE }));
    yield put(setCurrentSimulationRunnerStatus({ status: STATUSES.IDLE }));

    const failures = results.filter((result) => result.error);
    if (failures.length > 0) {
      const errorMessage = t('commoncomponents.banner.deleteBatch', "Some scenarios haven't been deleted.");
      yield put(setApplicationErrorMessage({ error: failures[0].error, errorMessage }));
    }
  } catch (error) {
    yield put(setListStatus({ status: STATUSES.IDLE }));
    yield put(setCurrentSimulationRunnerStatus({ status: STATUSES.IDLE }));

    const errorMessage = t('commoncomponents.banner.deleteBatch', "Some scenarios haven't been deleted.");
    yield put(setApplicationErrorMessage({ error, errorMessage }));
  }
}

function* deleteRunnerBatchSaga() {
  yield takeEvery(RUNNER_ACTIONS_KEY.DELETE_RUNNER_BATCH, callDeleteRunnerBatch);
}

export default deleteRunnerBatchSaga;
