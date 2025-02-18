// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { takeEvery, call, put } from 'redux-saga/effects';
import { Api } from '../../../services/config/Api';
import { setApplicationErrorMessage } from '../../app/reducers';
import { DATASET_ACTIONS_KEY } from '../constants';
import { updateDataset } from '../reducers';

export function* callUpdateDataset(action) {
  const organizationId = action.organizationId;
  const datasetId = action.datasetId;
  const datasetData = action.datasetData;
  const datasetIndex = action.selectedDatasetIndex;

  try {
    yield call(Api.Datasets.updateDataset, organizationId, datasetId, datasetData);
    yield put(
      updateDataset({
        datasetId,
        datasetData,
        datasetIndex,
      })
    );
  } catch (error) {
    yield put(
      setApplicationErrorMessage({
        error,
        errorMessage: t('commoncomponents.banner.datasetNotUpdated', "Dataset {datasetId} hasn't been updated", {
          datasetId,
        }),
      })
    );
  }
}

function* updateDatasetSaga() {
  yield takeEvery(DATASET_ACTIONS_KEY.UPDATE_DATASET, callUpdateDataset);
}

export default updateDatasetSaga;
