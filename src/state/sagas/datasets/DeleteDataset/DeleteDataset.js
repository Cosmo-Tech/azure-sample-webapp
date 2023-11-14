// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { takeEvery, call, put, select } from 'redux-saga/effects';
import { t } from 'i18next';
import { Api } from '../../../../services/config/Api';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';
import { DATASET_ACTIONS_KEY } from '../../../commons/DatasetConstants';
import { STATUSES } from '../../../commons/Constants';

const getDatasets = (state) => state.dataset.list.data;
const getSelectedDatasetIndex = (state) => state.dataset.selectedDatasetIndex?.data;

export function* deleteDataset(action) {
  try {
    const datasets = yield select(getDatasets);
    const selectedDatasetIndex = yield select(getSelectedDatasetIndex);
    const selectedDatasetId = datasets[selectedDatasetIndex]?.id;

    const organizationId = action.organizationId;
    const datasetId = action.datasetId;

    const filteredDatasets = datasets.filter((dataset) => dataset.id !== datasetId);
    const newSelectedDatasetIndex = filteredDatasets.findIndex((dataset) => dataset.id === selectedDatasetId);

    yield call(Api.Datasets.deleteDataset, organizationId, datasetId);

    yield put({
      type: DATASET_ACTIONS_KEY.SET_ALL_DATASETS,
      list: filteredDatasets,
      selectedDatasetIndex: newSelectedDatasetIndex,
      status: STATUSES.SUCCESS,
    });
  } catch (error) {
    yield put(
      dispatchSetApplicationErrorMessage(
        error,
        t('commoncomponents.banner.datasetNotDeleted', "Dataset hasn't been deleted")
      )
    );
    yield put({
      type: DATASET_ACTIONS_KEY.SET_ALL_DATASETS,
      status: STATUSES.SUCCESS,
    });
  }
}

function* deleteDatasetSaga() {
  yield takeEvery(DATASET_ACTIONS_KEY.DELETE_DATASET, deleteDataset);
}

export default deleteDatasetSaga;
