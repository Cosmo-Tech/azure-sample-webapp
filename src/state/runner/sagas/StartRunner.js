// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import { AppInsights } from '../../../services/AppInsights';
import { Api } from '../../../services/config/Api';
import { RUNNER_RUN_STATE } from '../../../services/config/ApiConstants';
import { STATUSES } from '../../../services/config/StatusConstants';
import { RunnersUtils } from '../../../utils';
import { setApplicationErrorMessage } from '../../app/reducers';
import { RUNNER_ACTIONS_KEY } from '../constants';
import { addRun, updateRunner } from '../reducers';

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

    yield put(
      updateRunner({
        runnerId,
        runner: { state: RUNNER_RUN_STATE.RUNNING },
      })
    );

    // Start runner if parameters update succeeded
    let response;
    try {
      response = yield call(Api.Runners.startRun, organizationId, workspaceId, runnerId);
    } catch (error) {
      console.error(error);
      yield put(
        setApplicationErrorMessage({
          error,
          errorMessage: t('commoncomponents.banner.run', 'A problem occurred when starting the scenario run.'),
        })
      );
      yield put(
        updateRunner({
          runnerId,
          status: STATUSES.ERROR,
          runner: { state: previousRunnerState }, // Do not force runner state to "Failed", restore previous state
        })
      );
      return;
    }

    const lastRunId = RunnersUtils.getRunIdFromRunnerStart(response.data);
    const lastRunIdPatch = RunnersUtils.forgeRunnerLastRunIdPatch(lastRunId);
    yield put(
      updateRunner({
        runnerId,
        runner: { state: RUNNER_RUN_STATE.RUNNING, ...lastRunIdPatch },
      })
    );
    yield put(addRun({ data: { id: lastRunId } }));

    // Start backend polling to update the scenario status
    yield put({
      type: RUNNER_ACTIONS_KEY.START_RUNNER_STATUS_POLLING,
      organizationId,
      workspaceId,
      runnerId,
      lastRunId,
    });
  } catch (error) {
    console.error(error);
    yield put(
      setApplicationErrorMessage({
        error,
        errorMessage: t('commoncomponents.banner.run', 'A problem occurred during the scenario run.'),
      })
    );
    yield put(
      updateRunner({
        runnerId,
        status: STATUSES.ERROR,
        runner: { state: RUNNER_RUN_STATE.FAILED },
      })
    );
  }
}

function* startRunnerSaga() {
  yield takeEvery(RUNNER_ACTIONS_KEY.START_RUNNER, startRunner);
}

export default startRunnerSaga;
