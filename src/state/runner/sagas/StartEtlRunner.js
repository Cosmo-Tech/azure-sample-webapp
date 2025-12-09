// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import { Api } from '../../../services/config/Api';
import { RUNNER_RUN_STATE } from '../../../services/config/ApiConstants';
import { STATUSES } from '../../../services/config/StatusConstants';
import { RunnersUtils } from '../../../utils';
import { setApplicationErrorMessage } from '../../app/reducers';
import { RUNNER_ACTIONS_KEY } from '../constants';
import { addRun, updateEtlRunner } from '../reducers';

const getETLRunners = (state) => state.runner?.etlRunners?.list?.data;

// TODO: factorize with StartRunner to avoid duplicated code
export function* startETLRunner(action) {
  const { organizationId, workspaceId, runnerId } = action;

  const runners = yield select(getETLRunners);
  const runner = runners?.find((item) => item.id === runnerId);
  if (runner === undefined) {
    console.warn(`Couldn't retrieve runner with id "${runnerId}"`);
    return;
  }
  const previousLastRunInfo = runner.lastRunInfo;

  try {
    const runningLastRunInfo = { ...runner.lastRunInfo, lastRunStatus: RUNNER_RUN_STATE.RUNNING };
    yield put(updateEtlRunner({ runnerId, runner: { lastRunInfo: runningLastRunInfo } }));

    let response;
    try {
      response = yield call(Api.Runners.startRun, organizationId, workspaceId, runnerId);
    } catch (error) {
      console.error(error);
      const errorMessage = t('commoncomponents.banner.etlStartFailed', 'A problem occurred when starting the ETL run.');
      yield put(setApplicationErrorMessage({ error, errorMessage }));
      yield put(
        updateEtlRunner({
          status: STATUSES.ERROR,
          runnerId,
          runner: { lastRunInfo: previousLastRunInfo }, // Do not force runner state to "Failed", restore previous state
        })
      );
      return;
    }

    const lastRunId = RunnersUtils.getRunIdFromRunnerStart(response.data);
    const lastRunInfoPatch = RunnersUtils.forgeRunnerLastRunInfoPatch(lastRunId, RUNNER_RUN_STATE.RUNNING);
    yield put(updateEtlRunner({ runnerId, runner: { ...lastRunInfoPatch } }));
    yield put(addRun({ data: { id: lastRunId } }));

    // Start backend polling to update the scenario status
    yield put({
      type: RUNNER_ACTIONS_KEY.START_RUNNER_STATUS_POLLING,
      organizationId,
      workspaceId,
      runnerId,
      lastRunId,
      runnerType: 'etl',
    });
  } catch (error) {
    console.error(error);
    const errorMessage = t('commoncomponents.banner.etlRunFailed', 'A problem occurred during the ETL run.');
    yield put(setApplicationErrorMessage({ error, errorMessage }));
    const lastRunId = previousLastRunInfo.lastRunId;
    const lastRunInfoPatch = RunnersUtils.forgeRunnerLastRunInfoPatch(lastRunId, RUNNER_RUN_STATE.FAILED);
    yield put(updateEtlRunner({ runnerId, status: STATUSES.ERROR, runner: { ...lastRunInfoPatch } }));
  }
}

function* startEtlRunnerSaga() {
  yield takeEvery(RUNNER_ACTIONS_KEY.START_ETL_RUNNER, startETLRunner);
}

export default startEtlRunnerSaga;
