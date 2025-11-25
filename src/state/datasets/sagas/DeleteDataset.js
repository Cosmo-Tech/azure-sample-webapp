// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { takeEvery, call, put, select } from 'redux-saga/effects';
import { Api } from '../../../services/config/Api';
import { DatasetsUtils } from '../../../utils';
import { setApplicationErrorMessage } from '../../app/reducers';
import { RUNNER_ACTIONS_KEY } from '../../runner/constants';
import { DATASET_ACTIONS_KEY } from '../constants';
import { deleteDataset, selectDataset } from '../reducers';

const getWorkspaceId = (state) => state.workspace.current?.data?.id;
const getDatasets = (state) => state.dataset.list?.data;

export function* callDeleteDataset(action) {
  try {
    const organizationId = action.organizationId;
    const datasetId = action.datasetId;
    const selectedDatasetId = action.selectedDatasetId;
    const workspaceId = yield select(getWorkspaceId);
    const datasets = yield select(getDatasets);

    const datasetToDelete = datasets.find((dataset) => dataset.id === datasetId);
    if (datasetToDelete) {
      const runnerId = DatasetsUtils.getDatasetOption(datasetToDelete, 'runnerId');
      if (runnerId) {
        yield put({
          type: RUNNER_ACTIONS_KEY.DELETE_RUNNER,
          organizationId,
          workspaceId,
          datasetId,
          runnerId,
          runnerType: 'etl',
        });
      }
    }

    yield call(Api.Datasets.deleteDataset, organizationId, workspaceId, datasetId);
    yield put(deleteDataset({ datasetId }));
    yield put(selectDataset({ selectedDatasetId: datasetId !== selectedDatasetId ? selectedDatasetId : null }));
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
