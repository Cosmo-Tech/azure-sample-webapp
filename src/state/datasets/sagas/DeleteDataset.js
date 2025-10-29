// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { takeEvery, call, put, select } from 'redux-saga/effects';
import { Api } from '../../../services/config/Api';
import { setApplicationErrorMessage } from '../../app/reducers';
import { DATASET_ACTIONS_KEY } from '../constants';
import { deleteDataset, selectDataset } from '../reducers';

const getWorkspaceId = (state) => state.workspace.current?.data?.id;

export function* callDeleteDataset(action) {
  try {
    const organizationId = action.organizationId;
    const datasetId = action.datasetId;
    const selectedDatasetId = action.selectedDatasetId;
    const workspaceId = yield select(getWorkspaceId);

    yield call(Api.Datasets.deleteDataset, organizationId, workspaceId, datasetId);

    yield put(
      deleteDataset({
        datasetId,
      })
    );

    yield put(
      selectDataset({
        selectedDatasetId: datasetId !== selectedDatasetId ? selectedDatasetId : null,
      })
    );
  } catch (error) {
    yield put(
      setApplicationErrorMessage({
        error,
        errorMessage: t('commoncomponents.banner.datasetNotDeleted', "Dataset hasn't been deleted"),
      })
    );
  }
}

function* deleteDatasetSaga() {
  yield takeEvery(DATASET_ACTIONS_KEY.DELETE_DATASET, callDeleteDataset);
}

export default deleteDatasetSaga;
