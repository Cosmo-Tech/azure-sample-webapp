// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { takeEvery, call, put } from 'redux-saga/effects';
import { Api } from '../../../../services/config/Api';
import { DATASET_ACTIONS_KEY } from '../../../commons/DatasetConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

export function* updateDataset(action) {
  const organizationId = action.organizationId;
  const datasetId = action.datasetId;
  const datasetData = action.datasetData;
  const datasetIndex = action.selectedDatasetIndex;

  try {
    yield call(Api.Datasets.updateDataset, organizationId, datasetId, datasetData);
    yield put({
      type: DATASET_ACTIONS_KEY.UPDATE_DATASET,
      datasetId,
      datasetData,
      datasetIndex,
    });
  } catch (error) {
    yield put(
      dispatchSetApplicationErrorMessage(
        error,
        t('commoncomponents.banner.datasetNotUpdated', "Dataset {datasetId} hasn't been updated", { datasetId })
      )
    );
  }
}

function* updateDatasetSaga() {
  yield takeEvery(DATASET_ACTIONS_KEY.TRIGGER_SAGA_UPDATE_DATASET, updateDataset);
}

export default updateDatasetSaga;
