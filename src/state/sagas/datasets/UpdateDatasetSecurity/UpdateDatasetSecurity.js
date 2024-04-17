// Copyright (c) Cosmo Tech.
// Licensed under the MIT licence.
import { t } from 'i18next';
import { takeEvery, select, call, put } from 'redux-saga/effects';
import DatasetService from '../../../../services/dataset/DatasetService';
import RunnerService from '../../../../services/runner/RunnerService';
import { DATASET_ACTIONS_KEY } from '../../../commons/DatasetConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

const getOrganizationId = (state) => state.organization.current.data.id;
const getWorkspaceId = (state) => state.workspace.current.data.id;
const getDatasetListData = (state) => state.dataset.list.data;

export function* updateDatasetSecurity(action) {
  const datasetId = action.datasetId;
  try {
    const organizationId = yield select(getOrganizationId);
    const workspaceId = yield select(getWorkspaceId);
    const datasetListData = yield select(getDatasetListData);
    const dataset = datasetListData.find((dataset) => dataset.id === datasetId);
    const oldDatasetSecurity = dataset?.security;
    const newDatasetSecurity = action.datasetSecurity;
    const currentUserPermissions = dataset.security.currentUserPermissions;

    yield call(DatasetService.updateSecurity, organizationId, datasetId, oldDatasetSecurity, newDatasetSecurity);

    const datasetUpdated = { ...dataset, security: { ...newDatasetSecurity, currentUserPermissions } };
    yield put({
      type: DATASET_ACTIONS_KEY.UPDATE_DATASET,
      datasetId,
      datasetData: datasetUpdated,
    });

    const runnerId = dataset.source?.name;
    try {
      if (runnerId != null) {
        yield call(
          RunnerService.updateSecurity,
          organizationId,
          workspaceId,
          runnerId,
          oldDatasetSecurity,
          newDatasetSecurity
        );
      }
    } catch (error) {
      console.error(error);
      yield put(
        dispatchSetApplicationErrorMessage(
          error,
          t(
            'commoncomponents.banner.runnerSecurityNotUpdated',
            `Runner {{runnerId}} permissions have not been updated`,
            { runnerId }
          )
        )
      );
    }
  } catch (error) {
    console.error(error);
    yield put(
      dispatchSetApplicationErrorMessage(
        error,
        t(
          'commoncomponents.banner.datasetSecurityNotUpdated',
          `Dataset {{datasetId}} permissions have not been updated`,
          { datasetId }
        )
      )
    );
  }
}

function* updateDatasetSecuritySaga() {
  yield takeEvery(DATASET_ACTIONS_KEY.TRIGGER_SAGA_UPDATE_DATASET_SECURITY, updateDatasetSecurity);
}

export default updateDatasetSecuritySaga;
