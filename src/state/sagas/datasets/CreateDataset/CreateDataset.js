// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { call, put, takeEvery, select } from 'redux-saga/effects';
import { t } from 'i18next';
import { Api } from '../../../../services/config/Api';
import { DATASET_ACTIONS_KEY } from '../../../commons/DatasetConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';
import { INGESTION_STATUS } from '../../../../services/config/ApiConstants';
import { DatasetsUtils } from '../../../../utils/DatasetsUtils';

const getUserName = (state) => state.auth.userName;

export function* createDataset(action) {
  const dataset = action.dataset;
  const organizationId = action.organizationId;
  const ownerName = yield select(getUserName);
  dataset.ownerName = ownerName;
  try {
    const { data } = yield call(Api.Datasets.createDataset, organizationId, dataset);

    yield put({
      type: DATASET_ACTIONS_KEY.ADD_DATASET,
      ...data,
      ownerName,
      ingestionStatus: dataset.sourceType !== 'None' ? INGESTION_STATUS.PENDING : INGESTION_STATUS.NONE,
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
    } else if (dataset.sourceType === 'File') {
      const response = yield call(DatasetsUtils.uploadZipWithFetchApi, organizationId, data.id, dataset.file.file);
      if (response?.ok) {
        yield put({
          type: DATASET_ACTIONS_KEY.TRIGGER_SAGA_START_TWINGRAPH_STATUS_POLLING,
          datasetId: data.id,
          organizationId,
        });
      }
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
