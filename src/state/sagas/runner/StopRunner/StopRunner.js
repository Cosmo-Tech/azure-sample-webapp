// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { put, takeEvery, call, select } from 'redux-saga/effects';
import { Api } from '../../../../services/config/Api';
import { INGESTION_STATUS } from '../../../../services/config/ApiConstants';
import { DATASET_ACTIONS_KEY } from '../../../commons/DatasetConstants';
import { RUNNER_ACTIONS_KEY } from '../../../commons/RunnerConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

const getDatasets = (state) => state.dataset?.list?.data;

export function* stopRunner(action) {
  const datasetId = action.datasetId;
  const datasets = yield select(getDatasets);
  const dataset = datasets.find((dataset) => dataset.id === datasetId);
  const runnerId = dataset?.source?.name;

  try {
    const organizationId = action.organizationId;
    const workspaceId = action.workspaceId;

    yield call(Api.Runners.stopRun, organizationId, workspaceId, runnerId);
    yield put({
      type: DATASET_ACTIONS_KEY.UPDATE_DATASET,
      datasetId,
      datasetData: { ingestionStatus: INGESTION_STATUS.ERROR },
    });
  } catch (error) {
    console.error(error);
    yield put(
      dispatchSetApplicationErrorMessage(
        error,
        t('commoncomponents.banner.runnerStopError', 'Could not stop runner "{{runnerId}}".', {
          runnerId,
        })
      )
    );
  }
}

function* stopRunnerSaga() {
  yield takeEvery(RUNNER_ACTIONS_KEY.TRIGGER_SAGA_STOP_RUNNER, stopRunner);
}

export default stopRunnerSaga;
