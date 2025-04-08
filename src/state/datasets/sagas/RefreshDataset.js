// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { call, put, takeEvery, select } from 'redux-saga/effects';
import { Api } from '../../../services/config/Api';
import { setApplicationErrorMessage } from '../../app/reducers';
import { DATASET_ACTIONS_KEY } from '../constants';
import { updateDataset } from '../reducers';

const getDatasetListData = (state) => state.dataset.list.data;

export function* refreshDataset(action) {
  const datasetId = action.datasetId;

  try {
    const organizationId = action.organizationId;
    const { data: refreshData } = yield call(Api.Datasets.refreshDataset, organizationId, datasetId);
    const datasetListData = yield select(getDatasetListData);
    const dataset = datasetListData.find((dataset) => dataset.id === datasetId);

    yield put(
      updateDataset({
        datasetId,
        datasetData: { ingestionStatus: refreshData.status, source: { ...dataset.source, jobId: refreshData.jobId } },
      })
    );

    yield put({
      type: DATASET_ACTIONS_KEY.START_TWINGRAPH_STATUS_POLLING,
      datasetId,
      organizationId,
    });
  } catch (error) {
    console.error(error);
    yield put(
      setApplicationErrorMessage({
        error,
        errorMessage: t(
          'commoncomponents.banner.datasetRefreshError',
          'A problem occurred during refresh of the dataset {{datasetId}}',
          { datasetId }
        ),
      })
    );
  }
}

function* refreshDatasetSaga() {
  yield takeEvery(DATASET_ACTIONS_KEY.REFRESH_DATASET, refreshDataset);
}

export default refreshDatasetSaga;
