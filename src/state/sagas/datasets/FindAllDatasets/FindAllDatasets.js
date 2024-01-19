// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { call, put, select, takeEvery } from 'redux-saga/effects';
import { DATASET_ACTIONS_KEY } from '../../../commons/DatasetConstants';
import { Api } from '../../../../services/config/Api';
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
}

function* findAllDatasetsData() {
  yield takeEvery(DATASET_ACTIONS_KEY.GET_ALL_DATASETS, fetchAllDatasetsData);
}

export default findAllDatasetsData;
