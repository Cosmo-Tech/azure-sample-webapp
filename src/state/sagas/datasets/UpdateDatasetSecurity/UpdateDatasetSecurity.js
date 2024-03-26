// Copyright (c) Cosmo Tech.
// Licensed under the MIT licence.
import { t } from 'i18next';
import { takeEvery, select, call, put } from 'redux-saga/effects';
import DatasetService from '../../../../services/dataset/DatasetService';
import { DATASET_ACTIONS_KEY, DATASET_PERMISSIONS_MAPPING } from '../../../commons/DatasetConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

const getOrganizationId = (state) => state.organization.current.data.id;
const getDatasetListData = (state) => state.dataset.list.data;

export function* updateDatasetSecurity(action) {
  const datasetId = action.datasetId;
  try {
    const organizationId = yield select(getOrganizationId);
    const datasetListData = yield select(getDatasetListData);
    const dataset = datasetListData.find((dataset) => dataset.id === datasetId);
    const oldDatasetSecurity = dataset?.security;
    const newDatasetSecurity = action.newDatasetSecurity;

    yield select(DatasetService.updateSecurity, organizationId, datasetId, oldDatasetSecurity, newDatasetSecurity);

    yield put({
      type: DATASET_ACTIONS_KEY.UPDATE_DATASET,
      datasetId,
      security: newDatasetSecurity,
      DATASET_PERMISSIONS_MAPPING,
    });

    const runnerId = dataset.source?.name;
  } catch (error) {
    console.error(error);
    yield put(
      dispatchSetApplicationErrorMessage(
        error,
        t('commoncomponents.banner.datasetNotUpdated', `Dataset {{datasetId}} permissions have not been updated`)
      )
    );
  }
}

function* updateDatasetSecuritySaga() {
  yield takeEvery(DATASET_ACTIONS_KEY.TRIGGER_SAGA_UPDATE_DATASET_SECURITY, updateDatasetSecurity);
}

export default updateDatasetSecuritySaga;
