// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { call, put, select, take, takeEvery, delay, race } from 'redux-saga/effects';
import { Api } from '../../../services/config/Api';
import { RUNNER_RUN_STATE } from '../../../services/config/ApiConstants';
import {
  POLLING_MAX_CONSECUTIVE_NETWORK_ERRORS,
  POLLING_START_DELAY,
  RUNNER_STATUS_POLLING_DELAY,
} from '../../../services/config/FunctionalConstants';
import { STATUSES } from '../../../services/config/StatusConstants';
import { RunnersUtils } from '../../../utils';
import { setApplicationErrorMessage } from '../../app/reducers';
import { getDataset } from '../../datasets/sagas/GetDataset';
import { RUNNER_ACTIONS_KEY } from '../constants';
import { updateRun, updateEtlRunner, updateSimulationRunner } from '../reducers';

const getETLRunnerFromState = (state, runnerId) => {
  return state.runner.etlRunners.list.data?.find((runner) => runner.id === runnerId);
};

export function forgeStopPollingAction(runnerId) {
  let actionName = RUNNER_ACTIONS_KEY.STOP_RUNNER_STATUS_POLLING;
  actionName += '_' + runnerId;
  return { type: actionName, data: { runnerId } };
}

export function* pollRunnerState(action) {
  const { organizationId, workspaceId, runnerId, lastRunId, runnerType } = action;

  let updateRunner = updateSimulationRunner;
  if (runnerType === 'etl') updateRunner = updateEtlRunner;

  // Polling start is delayed to avoid an erroneous Unknown state due to the fact that in first seconds of the run,
  // the AKS container isn't created yet and runner.state passes to Unknown for a few seconds before returning to
  // Running again.
  // For more details, see https://cosmo-tech.atlassian.net/browse/SDCOSMO-1768
  yield delay(POLLING_START_DELAY);
  // Loop until the runner state is FAILED, SUCCESS or UNKNOWN
  let networkErrorsCount = 0;
  while (true) {
    try {
      const { data: runStatus } = yield call(
        Api.RunnerRuns.getRunStatus,
        organizationId,
        workspaceId,
        runnerId,
        lastRunId
      );

      networkErrorsCount = 0;
      if ([RUNNER_RUN_STATE.FAILED, RUNNER_RUN_STATE.SUCCESSFUL, RUNNER_RUN_STATE.UNKNOWN].includes(runStatus.state)) {
        if (runnerType === 'etl' && runStatus.state === RUNNER_RUN_STATE.SUCCESSFUL) {
          const runner = yield select(getETLRunnerFromState, runnerId);
          // Datasets created in the Dataset Manager are the first entry in runners' property "datasets.bases"
          const datasetId = runner?.datasets?.bases?.[0];
          if (datasetId != null) yield call(getDataset, organizationId, workspaceId, datasetId, true);
        }

        const lastRunInfoPatch = RunnersUtils.forgeRunnerLastRunInfoPatch(lastRunId, runStatus.state);
        yield put(updateRunner({ runnerId, runner: { ...lastRunInfoPatch } }));
        yield put(updateRun({ data: runStatus }));

        yield put(forgeStopPollingAction(runnerId));
      }

      yield delay(RUNNER_STATUS_POLLING_DELAY); // Wait before retrying
    } catch (error) {
      networkErrorsCount++;
      if (
        (!navigator.onLine || error.code === 'ERR_NETWORK') &&
        networkErrorsCount <= POLLING_MAX_CONSECUTIVE_NETWORK_ERRORS
      ) {
        yield delay(RUNNER_STATUS_POLLING_DELAY);
      } else {
        console.error(error);
        const errorMessage = t('commoncomponents.banner.run', 'A problem occurred during the scenario run.');
        yield put(setApplicationErrorMessage({ error, errorMessage }));

        const lastRunInfoPatch = RunnersUtils.forgeRunnerLastRunInfoPatch(lastRunId, RUNNER_RUN_STATE.FAILED);
        yield put(updateRunner({ runnerId, status: STATUSES.ERROR, runner: { ...lastRunInfoPatch } }));
        yield put(forgeStopPollingAction(runnerId));
      }
    }
  }
}

function* startPolling(action) {
  let stopActionName = RUNNER_ACTIONS_KEY.STOP_RUNNER_STATUS_POLLING;
  stopActionName += '_' + action.runnerId;
  yield put(forgeStopPollingAction(action.runnerId)); // Prevent double polling on same scenario

  yield race([
    call(pollRunnerState, action),
    take([stopActionName, RUNNER_ACTIONS_KEY.STOP_ALL_RUNNERS_STATUS_POLLING]),
  ]);
}

function* pollRunnerStateSaga() {
  yield takeEvery(RUNNER_ACTIONS_KEY.START_RUNNER_STATUS_POLLING, startPolling);
}

export default pollRunnerStateSaga;
