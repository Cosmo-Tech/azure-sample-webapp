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
import { addRun, updateSimulationRunner } from '../reducers';

const getRunners = (state) => state.runner?.simulationRunners?.list?.data;

export function* startRunner(action) {
  const { organizationId, workspaceId, runnerId } = action;

  const runners = yield select(getRunners);
  const runner = runners?.find((item) => item.id === runnerId);
  if (runner === undefined) {
    console.warn(`Couldn't retrieve scenario with id "${runnerId}"`);
    return;
  }
  const previousLastRunInfo = runner.lastRunInfo;

  try {
    const runningLastRunInfo = { ...runner.lastRunInfo, lastRunStatus: RUNNER_RUN_STATE.RUNNING };
    yield put(updateSimulationRunner({ runnerId, runner: { lastRunInfo: runningLastRunInfo } }));

    let response;
    try {
      response = yield call(Api.Runners.startRun, organizationId, workspaceId, runnerId);
    } catch (error) {
      console.error(error);
      const errorMessage = t('commoncomponents.banner.run', 'A problem occurred when starting the scenario run.');
      yield put(setApplicationErrorMessage({ error, errorMessage }));
      yield put(
        updateSimulationRunner({
          status: STATUSES.ERROR,
          runnerId,
          runner: { lastRunInfo: previousLastRunInfo }, // Do not force runner state to "Failed", restore previous state
        })
      );
      return;
    }

    const lastRunId = RunnersUtils.getRunIdFromRunnerStart(response.data);
    const lastRunInfoPatch = RunnersUtils.forgeRunnerLastRunInfoPatch(lastRunId, RUNNER_RUN_STATE.RUNNING);
    yield put(updateSimulationRunner({ runnerId, runner: { ...lastRunInfoPatch } }));
    yield put(addRun({ data: { id: lastRunId } }));

    // Start backend polling to update the scenario status
    yield put({
      type: RUNNER_ACTIONS_KEY.START_RUNNER_STATUS_POLLING,
      organizationId,
      workspaceId,
      runnerId,
      lastRunId,
      runnerType: 'simulation',
    });
  } catch (error) {
    console.error(error);
    const errorMessage = t('commoncomponents.banner.run', 'A problem occurred during the scenario run.');
    yield put(setApplicationErrorMessage({ error, errorMessage }));
    yield put(updateSimulationRunner({ runnerId, status: STATUSES.ERROR, runner: { state: RUNNER_RUN_STATE.FAILED } }));
  }
}

function* startRunnerSaga() {
  yield takeEvery(RUNNER_ACTIONS_KEY.START_RUNNER, startRunner);
}

export default startRunnerSaga;
