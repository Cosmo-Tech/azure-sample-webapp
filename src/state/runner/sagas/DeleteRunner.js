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
import { stopETLRunner } from './StopRunner';
import { stopSimulationRunner } from './StopSimulationRunner';

export function* callDeleteRunner(action) {
  const organizationId = action.organizationId;
  const workspaceId = action.workspaceId;
  const runnerId = action.runnerId;
  const isETLRunner = action.runnerType === 'etl';

  try {
    yield put(setListStatus({ status: STATUSES.LOADING }));

    const { data } = yield call(Api.Runners.getRunner, organizationId, workspaceId, runnerId);
    const lastRunStatus = RunnersUtils.getLastRunStatus(data);
    if (lastRunStatus === RUNNER_RUN_STATE.RUNNING) {
      if (isETLRunner) yield call(stopETLRunner, action);
      else yield call(stopSimulationRunner, action);

      yield put({ type: RUNNER_ACTIONS_KEY.STOP_RUNNER_STATUS_POLLING + '_' + runnerId, data: { runnerId } });
    }

    yield call(Api.Runners.deleteRunner, organizationId, workspaceId, runnerId);
    yield put(setListStatus({ status: STATUSES.IDLE }));
    yield put(deleteRunner({ runnerId }));
  } catch (error) {
    yield put(setListStatus({ status: STATUSES.IDLE }));

    let errorMessage = t('commoncomponents.banner.delete', "Scenario hasn't been deleted.");
    if (isETLRunner) errorMessage = t('commoncomponents.banner.etlDeleteFailed', "Dataset runner hasn't been deleted.");
    yield put(setApplicationErrorMessage({ error, errorMessage }));
  }
}

function* deleteRunnerSaga() {
  yield takeEvery(RUNNER_ACTIONS_KEY.DELETE_RUNNER, callDeleteRunner);
}

export default deleteRunnerSaga;
