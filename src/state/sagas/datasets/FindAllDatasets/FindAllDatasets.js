// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { call, put, select, takeEvery } from 'redux-saga/effects';
import { DATASET_ACTIONS_KEY } from '../../../commons/DatasetConstants';
import { Api } from '../../../../services/config/Api';
import { INGESTION_STATUS } from '../../../../services/config/ApiConstants';
import { STATUSES } from '../../../commons/Constants';
import { DatasetsUtils } from '../../../../utils';

// TODO: replace by data from redux when dataset roles-permissions mapping is added in back-end /permissions endpoint
const DATASET_PERMISSIONS_MAPPING = {
  viewer: ['read', 'read_security'],
  editor: ['read', 'read_security', 'write'],
  admin: ['read', 'read_security', 'write', 'write_security', 'delete'],
};

const getUserEmail = (state) => state.auth.userEmail;

export function* fetchAllDatasetsData(organizationId) {
  const userEmail = yield select(getUserEmail);
  const { data } = yield call(Api.Datasets.findAllDatasets, organizationId);

  data.forEach((dataset) =>
    DatasetsUtils.patchDatasetWithCurrentUserPermissions(dataset, userEmail, DATASET_PERMISSIONS_MAPPING)
  );

  yield put({
    type: DATASET_ACTIONS_KEY.SET_ALL_DATASETS,
    list: data,
    status: STATUSES.SUCCESS,
  });

  if (data?.length > 0) {
    yield put({
      type: DATASET_ACTIONS_KEY.SET_CURRENT_DATASET_INDEX,
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
}

function* findAllDatasetsData() {
  yield takeEvery(DATASET_ACTIONS_KEY.GET_ALL_DATASETS, fetchAllDatasetsData);
}

export default findAllDatasetsData;
