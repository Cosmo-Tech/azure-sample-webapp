// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { put, takeEvery, call, select } from 'redux-saga/effects';
import { Api } from '../../../services/config/Api';
import { RUNNER_RUN_STATE } from '../../../services/config/ApiConstants';
import { DatasetsUtils } from '../../../utils';
import { setApplicationErrorMessage } from '../../app/reducers';
import { updateDataset } from '../../datasets/reducers';
import { RUNNER_ACTIONS_KEY } from '../constants';

const getDatasets = (state) => state.dataset?.list?.data;

export function* stopETLRunner(action) {
  const datasetId = action.datasetId;
  const datasets = yield select(getDatasets);
  const dataset = datasets.find((dataset) => dataset.id === datasetId);
  const runnerId = DatasetsUtils.getDatasetOption(dataset, 'runnerId');

  try {
    const organizationId = action.organizationId;
    const workspaceId = action.workspaceId;

    yield call(Api.Runners.stopRun, organizationId, workspaceId, runnerId);
    // FIXME: force dataset runner status to failed in redux?
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
}

function* stopETLRunnerSaga() {
  yield takeEvery(RUNNER_ACTIONS_KEY.STOP_ETL_RUNNER, stopETLRunner);
}

export default stopETLRunnerSaga;
