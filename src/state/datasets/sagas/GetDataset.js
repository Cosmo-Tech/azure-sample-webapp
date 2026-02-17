// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import { Api } from '../../../services/config/Api';
import { DATASET_PERMISSIONS_MAPPING } from '../../../services/config/ApiConstants';
import { DatasetsUtils } from '../../../utils';
import { setApplicationErrorMessage } from '../../app/reducers';
import { DATASET_ACTIONS_KEY } from '../constants';
import { updateDataset } from '../reducers';

const getUserEmail = (state) => state.auth.userEmail;

export function* getDataset(organizationId, workspaceId, datasetId) {
  try {
    const userEmail = yield select(getUserEmail);
    const { data: dataset } = yield call(Api.Datasets.getDataset, organizationId, workspaceId, datasetId);
    DatasetsUtils.patchDatasetWithCurrentUserPermissions(dataset, userEmail, DATASET_PERMISSIONS_MAPPING);
    yield put(updateDataset({ datasetId, datasetData: dataset }));
  } catch (error) {
    console.error(error);
    yield put(
      setApplicationErrorMessage({
        error,
        errorMessage: t('commoncomponents.banner.updatePermissions', 'Unexpected error while fetching the dataset.'),
      })
    );
  }
}

function* getDatasetSaga() {
  yield takeEvery(DATASET_ACTIONS_KEY.GET_DATASET, getDataset);
}

export default getDatasetSaga;
