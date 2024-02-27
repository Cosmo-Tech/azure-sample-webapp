// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { call, put, takeEvery, select } from 'redux-saga/effects';
import { Api } from '../../../../services/config/Api';
import { DATASET_ACTIONS_KEY } from '../../../commons/DatasetConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

const getDatasetSource = (state) => {
  const selectedDatasetIndex = state.dataset.selectedDatasetIndex;
  return state.dataset.list.data[selectedDatasetIndex].source;
};

export function* refreshDataset(action) {
  try {
    const organizationId = action.organizationId;
    const datasetId = action.datasetId;
    const { data: refreshData } = yield call(Api.Datasets.refreshDataset, organizationId, datasetId);
    const datasetSource = yield select(getDatasetSource);

    yield put({
      type: DATASET_ACTIONS_KEY.UPDATE_DATASET,
      datasetId,
      datasetData: { ingestionStatus: refreshData.status, source: { ...datasetSource, jobId: refreshData.jobId } },
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
        t('commoncomponents.banner.datasetNotRefreshed', 'A problem occurred during dataset refresh')
      )
    );
  }
}

function* refreshDatasetSaga() {
  yield takeEvery(DATASET_ACTIONS_KEY.TRIGGER_SAGA_REFRESH_DATASET, refreshDataset);
}

export default refreshDatasetSaga;
