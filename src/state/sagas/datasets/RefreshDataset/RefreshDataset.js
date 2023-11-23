// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { call, put, takeEvery } from 'redux-saga/effects';
import { t } from 'i18next';
import { Api } from '../../../../services/config/Api';
import { DATASET_ACTIONS_KEY } from '../../../commons/DatasetConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

export function* refreshDataset(action) {
  try {
    const organizationId = action.organizationId;
    const datasetId = action.datasetId;
    const { data: refreshData } = yield call(Api.Datasets.refreshDataset, organizationId, datasetId);
    yield put({
      type: DATASET_ACTIONS_KEY.UPDATE_DATASET,
      datasetId,
      datasetData: { status: refreshData.status },
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
