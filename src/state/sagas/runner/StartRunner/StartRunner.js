// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import { AppInsights } from '../../../../services/AppInsights';
import { Api } from '../../../../services/config/Api';
import { RUNNER_RUN_STATE } from '../../../../services/config/ApiConstants';
import { STATUSES } from '../../../commons/Constants';
import { RUNNER_ACTIONS_KEY } from '../../../commons/RunnerConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

const appInsights = AppInsights.getInstance();
const getRunners = (state) => state.runner?.list?.data;

export function* startRunner(action) {
  const organizationId = action.organizationId;
  const workspaceId = action.workspaceId;
  const runnerId = action.runnerId;
  try {
    appInsights.trackScenarioLaunch();

    const runners = yield select(getRunners);
    const runner = runners?.find((item) => item.id === runnerId);
    if (runner === undefined) console.warn(`Couldn't retrieve scenario with id "${runnerId}"`);
    const previousRunnerState = runner?.state;

    yield put({
      type: RUNNER_ACTIONS_KEY.UPDATE_RUNNER,
      runnerId,
      runner: { state: RUNNER_RUN_STATE.RUNNING },
    });

    // Start runner if parameters update succeeded
    let response;
    try {
      response = yield call(Api.Runners.startRun, organizationId, workspaceId, runnerId);
    } catch (error) {
      console.error(error);
      yield put(
        dispatchSetApplicationErrorMessage(
          error,
          t('commoncomponents.banner.run', 'A problem occurred when starting the scenario run.')
        )
      );
      yield put({
        type: RUNNER_ACTIONS_KEY.UPDATE_RUNNER,
        runnerId,
        status: STATUSES.ERROR,
        runner: { state: previousRunnerState }, // Do not force runner state to "Failed", restore previous state
      });
      return;
    }

    yield put({
      type: RUNNER_ACTIONS_KEY.UPDATE_RUNNER,
      runnerId,
      runner: { state: RUNNER_RUN_STATE.RUNNING, lastRunId: response.data.id },
    });
    yield put({
      type: RUNNER_ACTIONS_KEY.ADD_RUN,
      data: { id: response.data.id },
    });
    // Start backend polling to update the scenario status
    yield put({
      type: RUNNER_ACTIONS_KEY.TRIGGER_SAGA_START_RUNNER_STATUS_POLLING,
      organizationId,
      workspaceId,
      runnerId,
      lastRunId: response.data,
    });
  } catch (error) {
    console.error(error);
    yield put(
      dispatchSetApplicationErrorMessage(
        error,
        t('commoncomponents.banner.run', 'A problem occurred during the scenario run.')
      )
    );
    yield put({
      type: RUNNER_ACTIONS_KEY.UPDATE_RUNNER,
      runnerId,
      status: STATUSES.ERROR,
      runner: { state: RUNNER_RUN_STATE.FAILED },
    });
  }
}

function* startRunnerSaga() {
  yield takeEvery(RUNNER_ACTIONS_KEY.TRIGGER_SAGA_START_RUNNER, startRunner);
}

export default startRunnerSaga;
