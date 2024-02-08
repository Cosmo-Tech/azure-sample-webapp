// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { t } from 'i18next';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import { Api } from '../../../../services/config/Api';
import { INGESTION_STATUS } from '../../../../services/config/ApiConstants';
import { ACL_PERMISSIONS } from '../../../../services/config/accessControl';
import { DatasetsUtils } from '../../../../utils';
import { STATUSES } from '../../../commons/Constants';
import { DATASET_ACTIONS_KEY } from '../../../commons/DatasetConstants';
import { dispatchSetApplicationErrorMessage } from '../../../dispatchers/app/ApplicationDispatcher';

// TODO: replace by data from redux when dataset roles-permissions mapping is added in back-end /permissions endpoint
const DATASET_PERMISSIONS_MAPPING = {
  viewer: ['read', 'read_security'],
  editor: ['read', 'read_security', 'write'],
  admin: ['read', 'read_security', 'write', 'write_security', 'delete'],
};

const getUserEmail = (state) => state.auth.userEmail;
const keepOnlyReadableDatasets = (datasets) =>
  datasets.filter(
    (dataset) =>
      dataset.security?.currentUserPermissions == null ||
      dataset.security.currentUserPermissions?.includes(ACL_PERMISSIONS.DATASET.READ)
  );

export function* fetchAllDatasetsData(organizationId) {
  try {
    const userEmail = yield select(getUserEmail);
    const { data } = yield call(Api.Datasets.findAllDatasets, organizationId);

    data.forEach((dataset) =>
      DatasetsUtils.patchDatasetWithCurrentUserPermissions(dataset, userEmail, DATASET_PERMISSIONS_MAPPING)
    );
    const datasets = keepOnlyReadableDatasets(data);

    yield put({
      type: DATASET_ACTIONS_KEY.SET_ALL_DATASETS,
      list: datasets,
      status: STATUSES.SUCCESS,
    });

    if (datasets?.length > 0) {
      yield put({
        type: DATASET_ACTIONS_KEY.SELECT_DATASET,
        selectedDatasetId: null,
      });
      const datasetsToUpdate = data.filter(
        (dataset) => dataset.main === true && dataset.ingestionStatus === INGESTION_STATUS.PENDING
      );

      for (const dataset of datasetsToUpdate) {
        yield put({
          type: DATASET_ACTIONS_KEY.TRIGGER_SAGA_START_TWINGRAPH_STATUS_POLLING,
          datasetId: dataset.id,
          organizationId,
        });
      }
    }
  } catch (error) {
    console.error(error);
    yield put(
      dispatchSetApplicationErrorMessage(
        error,
        t('commoncomponents.banner.updatePermissions', 'Unexpected error while loading the datasets.')
      )
    );
  }
}

function* findAllDatasetsData() {
  yield takeEvery(DATASET_ACTIONS_KEY.GET_ALL_DATASETS, fetchAllDatasetsData);
}

export default findAllDatasetsData;
