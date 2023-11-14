// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { put, select, takeEvery, call } from 'redux-saga/effects';
import { Api } from '../../../../services/config/Api';
import { DATASET_ACTIONS_KEY } from '../../../commons/DatasetConstants';
import { STATUSES } from '../../../commons/Constants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';
import { t } from 'i18next';

const getDatasets = (state) => state.dataset.list.data;

export function* createDataset(action) {
  const dataset = action.dataset;
  const organizationId = action.organizationId;
  try {
    const { data } = yield call(Api.Datasets.createDataset, organizationId, dataset);

    yield put({
      type: DATASET_ACTIONS_KEY.ADD_DATASET,
      ...data,
    });

    const datasets = yield select(getDatasets);
    const createdDatasetIndex = datasets.findIndex((dataset) => dataset.id === data.id);

    yield put({
      type: DATASET_ACTIONS_KEY.SET_ALL_DATASETS,
      list: datasets,
      selectedDatasetIndex: createdDatasetIndex,
      status: STATUSES.SUCCESS,
    });
  } catch (error) {
    console.error(error);
    yield put(
      dispatchSetApplicationErrorMessage(
        error,
        t('commoncomponents.banner.datasetNotCreated', "Dataset hasn't been created")
      )
    );
  }
}
function* createDatasetSaga() {
  yield takeEvery(DATASET_ACTIONS_KEY.CREATE_DATASET, createDataset);
}

export default createDatasetSaga;
