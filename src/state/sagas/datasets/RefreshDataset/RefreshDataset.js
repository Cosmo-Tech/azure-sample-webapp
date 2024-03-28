// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { call, put, takeEvery, select } from 'redux-saga/effects';
import { Api } from '../../../../services/config/Api';
import { DATASET_ACTIONS_KEY } from '../../../commons/DatasetConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

const getDatasetListData = (state) => state.dataset.list.data;

export function* refreshDataset(action) {
  const datasetId = action.datasetId;

  try {
    const organizationId = action.organizationId;
    const { data: refreshData } = yield call(Api.Datasets.refreshDataset, organizationId, datasetId);
    const datasetListData = yield select(getDatasetListData);
    const dataset = datasetListData.find((dataset) => dataset.id === datasetId);

    yield put({
      type: DATASET_ACTIONS_KEY.UPDATE_DATASET,
      datasetId,
      datasetData: { ingestionStatus: refreshData.status, source: { ...dataset.source, jobId: refreshData.jobId } },
    });

    yield put({
      type: DATASET_ACTIONS_KEY.TRIGGER_SAGA_START_TWINGRAPH_STATUS_POLLING,
      datasetId,
      organizationId,
    });
  } catch (error) {
    console.error(error);
    yield put(
      dispatchSetApplicationErrorMessage(
        error,
        t(
          'commoncomponents.banner.datasetRefreshError',
          'A problem occurred during refresh of the dataset {{datasetId}}'
        )
      )
    );
  }
}

function* refreshDatasetSaga() {
  yield takeEvery(DATASET_ACTIONS_KEY.TRIGGER_SAGA_REFRESH_DATASET, refreshDataset);
}

export default refreshDatasetSaga;
