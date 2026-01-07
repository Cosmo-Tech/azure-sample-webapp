// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import { Api } from '../../../services/config/Api';
import { RUNNER_RUN_STATE } from '../../../services/config/ApiConstants';
import { setApplicationErrorMessage } from '../../app/reducers';
import { RUNNER_ACTIONS_KEY } from '../constants';
import { updateSimulationRunner } from '../reducers';

const getRunners = (state) => state.runner?.simulationRunners?.list?.data;

export function* stopSimulationRunner(action) {
  const { organizationId, workspaceId, runnerId } = action;

  const runners = yield select(getRunners);
  const runner = runners?.find((item) => item.id === runnerId);

  try {
    yield call(Api.Runners.stopRun, organizationId, workspaceId, runnerId);

    const failedLastRunInfo = { ...runner.lastRunInfo, lastRunStatus: RUNNER_RUN_STATE.FAILED };
    yield put(updateSimulationRunner({ runnerId, runner: { lastRunInfo: failedLastRunInfo } }));

    yield put({ type: `${RUNNER_ACTIONS_KEY.STOP_RUNNER_STATUS_POLLING}_${runnerId}`, data: { runnerId } });
  } catch (error) {
    console.error(error);
    yield put(
      setApplicationErrorMessage({
        error,
        errorMessage: t('views.scenario.scenarioRunStopError.comment', 'Could not stop scenario with id "{{id}}".', {
          id: runnerId,
        }),
      })
    );
  }
}

function* stopSimulationRunnerSaga() {
  yield takeEvery(RUNNER_ACTIONS_KEY.STOP_SIMULATION_RUNNER, stopSimulationRunner);
}

export default stopSimulationRunnerSaga;
