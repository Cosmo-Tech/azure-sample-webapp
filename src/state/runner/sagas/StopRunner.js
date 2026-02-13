// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { put, takeEvery, call, select } from 'redux-saga/effects';
import { Api } from '../../../services/config/Api';
import { RUNNER_RUN_STATE } from '../../../services/config/ApiConstants';
import { DatasetsUtils } from '../../../utils';
import { setApplicationErrorMessage } from '../../app/reducers';
import { DATASET_REDUCER_STATUS } from '../../datasets/constants';
import { updateDataset, setDatasetReducerStatus } from '../../datasets/reducers';
import { RUNNER_ACTIONS_KEY } from '../constants';
import { updateEtlRunner } from '../reducers';
import { forgeStopPollingAction } from './PollRunnerState.js';

const getDatasets = (state) => state.dataset?.list?.data;
const getETLRunners = (state) => state.runner?.etlRunners?.list?.data;

export function* stopETLRunner(action) {
  yield put(setDatasetReducerStatus({ status: DATASET_REDUCER_STATUS.STOPPING }));
  const datasetId = action.datasetId;
  const datasets = yield select(getDatasets);
  const dataset = datasets.find((dataset) => dataset.id === datasetId);
  const runnerId = DatasetsUtils.getDatasetOption(dataset, 'runnerId');

  const runners = yield select(getETLRunners);
  const runner = runners?.find((item) => item.id === runnerId);
  if (runner === undefined) {
    console.warn(`Couldn't retrieve runner with id "${runnerId}"`);
    yield put(setDatasetReducerStatus({ status: DATASET_REDUCER_STATUS.SUCCESS }));
    return;
  }

  try {
    const organizationId = action.organizationId;
    const workspaceId = action.workspaceId;

    yield put(forgeStopPollingAction(runnerId));
    yield call(Api.Runners.stopRun, organizationId, workspaceId, runnerId);
    const runningLastRunInfo = { ...runner.lastRunInfo, lastRunStatus: RUNNER_RUN_STATE.FAILED };
    yield put(updateEtlRunner({ runnerId, runner: { lastRunInfo: runningLastRunInfo } }));
    yield put(updateDataset({ datasetId, datasetData: { ingestionStatus: RUNNER_RUN_STATE.FAILED } }));
  } catch (error) {
    console.error(error);
    yield put(
      setApplicationErrorMessage({
        error,
        errorMessage: t('commoncomponents.banner.runnerStopError', 'Could not stop runner "{{runnerId}}".', {
          runnerId,
        }),
      })
    );
  }

  yield put(setDatasetReducerStatus({ status: DATASET_REDUCER_STATUS.SUCCESS }));
}

function* stopETLRunnerSaga() {
  yield takeEvery(RUNNER_ACTIONS_KEY.STOP_ETL_RUNNER, stopETLRunner);
}

export default stopETLRunnerSaga;
