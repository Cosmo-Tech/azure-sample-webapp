// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { call, put, takeEvery } from 'redux-saga/effects';
import { t } from 'i18next';
import { Auth } from '@cosmotech/core';
import { Api } from '../../../../services/config/Api';
import { DATASET_ACTIONS_KEY } from '../../../commons/DatasetConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';
import { TWINGRAPH_STATUS } from '../../../../services/config/ApiConstants';

const uploadZipWithFetchApi = async (organizationId, datasetId, file) => {
  try {
    const tokens = await Auth.acquireTokens();
    const headers = {
      Authorization: 'Bearer ' + tokens.accessToken,
      'Content-Type': 'application/octet-stream',
    };
    return await fetch(`${Api.defaultBasePath}/organizations/${organizationId}/datasets/${datasetId}`, {
      method: 'POST',
      headers,
      body: file,
    });
  } catch (error) {
    console.error(error);
    dispatchSetApplicationErrorMessage(
      error,
      t('commoncomponents.banner.twingraphNotCreated', 'A problem occurred during twingraph creation')
    );
  }
};

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

    if (!['None', 'File'].includes(dataset.sourceType)) {
      yield put({
        type: DATASET_ACTIONS_KEY.TRIGGER_SAGA_REFRESH_DATASET,
        organizationId,
        datasetId: data.id,
      });
    } else if (dataset.sourceType === 'File') {
      const response = yield call(uploadZipWithFetchApi, organizationId, data.id, dataset.file.file);
      if (response?.status === 201) {
        yield put({
          type: DATASET_ACTIONS_KEY.UPDATE_DATASET,
          datasetId: data.id,
          datasetData: { status: TWINGRAPH_STATUS.READY },
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
