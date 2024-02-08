// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { takeEvery, call, put } from 'redux-saga/effects';
import { Api } from '../../../../services/config/Api';
import { DATASET_ACTIONS_KEY } from '../../../commons/DatasetConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

export function* deleteDataset(action) {
  try {
    const organizationId = action.organizationId;
    const datasetId = action.datasetId;
    const selectedDatasetId = action.selectedDatasetId;

    yield call(Api.Datasets.deleteDataset, organizationId, datasetId);

    yield put({
      type: DATASET_ACTIONS_KEY.DELETE_DATASET,
      datasetId,
    });

    yield put({
      type: DATASET_ACTIONS_KEY.SELECT_DATASET,
      selectedDatasetId: datasetId !== selectedDatasetId ? selectedDatasetId : null,
    });
  } catch (error) {
    yield put(
      dispatchSetApplicationErrorMessage(
        error,
        t('commoncomponents.banner.datasetNotDeleted', "Dataset hasn't been deleted")
      )
    );
  }
}

function* deleteDatasetSaga() {
  yield takeEvery(DATASET_ACTIONS_KEY.TRIGGER_SAGA_DELETE_DATASET, deleteDataset);
}

export default deleteDatasetSaga;
