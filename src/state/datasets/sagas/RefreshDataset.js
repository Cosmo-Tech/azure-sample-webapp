// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { put, takeEvery, select } from 'redux-saga/effects';
import { setApplicationErrorMessage } from '../../app/reducers';
import { DATASET_ACTIONS_KEY } from '../constants';
import { updateDataset } from '../reducers';

const getDatasetListData = (state) => state.dataset.list.data;

export function* refreshDataset(action) {
  const datasetId = action.datasetId;

  try {
    const organizationId = action.organizationId;
    // FIXME: the "refresh dataset" endpoint  no longer exists, replace the call below by a "/start" call to the dataset
    // Runner if it exists (for ETLs). The last run id no longer has to be patched in redux, because the Dataset object
    // does not hold this information anymore in v5. Yet we may have to force an update of the Runner data in redux to
    // update the value of the last run id
    // const { data: refreshData } = yield call(Api.Datasets.refreshDataset, organizationId, datasetId);
    const refreshData = {};

    const datasetListData = yield select(getDatasetListData);
    const dataset = datasetListData.find((dataset) => dataset.id === datasetId);

    yield put(
      updateDataset({
        datasetId,
        datasetData: { ingestionStatus: refreshData.status, source: { ...dataset.source } },
      })
    );

    yield put({ type: DATASET_ACTIONS_KEY.START_TWINGRAPH_STATUS_POLLING, datasetId, organizationId });
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
