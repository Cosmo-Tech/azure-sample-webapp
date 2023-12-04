// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { put, takeEvery, call } from 'redux-saga/effects';
import { t } from 'i18next';
import { Api } from '../../../../services/config/Api';
import { DATASET_ACTIONS_KEY } from '../../../commons/DatasetConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

export function* createDataset(action) {
  const dataset = action.dataset;
  const organizationId = action.organizationId;
  try {
    if (dataset.sourceType === 'File') {
      // file = dataset.file;
      // delete dataset.file;
      dataset.source = null;
    }
    const { data } = yield call(Api.Datasets.createDataset, organizationId, dataset);

    if (dataset.sourceType === 'File') {
      // const stringified = JSON.stringify(dataset.file.file);
      // console.log(stringified);
      // const file = new Blob([dataset.file.file], { type: 'application/octet-stream' });
      debugger;
      yield call(Api.Datasets.uploadTwingraph, organizationId, data?.id, dataset.file.file);
      /*      yield call(
        Api.Workspaces.uploadWorkspaceFile,
        organizationId,
        'w-81264wr3xw5q5',
        dataset.file.file,
        true,
        'datasets/d-p40qvp6eme6m/initial_stock_dataset.zip'
      ); */
    }

    yield put({
      type: DATASET_ACTIONS_KEY.ADD_DATASET,
      ...data,
    });

    yield put({
      type: DATASET_ACTIONS_KEY.SET_CURRENT_DATASET_INDEX,
      selectedDatasetId: data.id,
    });

    if (!['None', 'File'].includes(dataset.sourceType)) {
      yield put({
        type: DATASET_ACTIONS_KEY.TRIGGER_SAGA_REFRESH_DATASET,
        organizationId,
        datasetId: data.id,
      });
    }
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
