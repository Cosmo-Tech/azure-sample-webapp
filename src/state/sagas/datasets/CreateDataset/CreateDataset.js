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
    const { data } = yield call(Api.Datasets.createDataset, organizationId, dataset);

    yield put({
      type: DATASET_ACTIONS_KEY.ADD_DATASET,
      ...data,
    });

    yield put({
      type: DATASET_ACTIONS_KEY.SET_CURRENT_DATASET_INDEX,
      selectedDatasetId: data.id,
    });

    if (dataset.sourceType !== 'None') {
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
