// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { call, put, takeEvery } from 'redux-saga/effects';
import { DATASET_ACTIONS_KEY } from '../../../commons/DatasetConstants';
import { Api } from '../../../../services/config/Api';
import { STATUSES } from '../../../commons/Constants';

export function* fetchAllDatasetsData(organizationId) {
  const { data } = yield call(Api.Datasets.findAllDatasets, organizationId);

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
  }
}

function* findAllDatasetsData() {
  yield takeEvery(DATASET_ACTIONS_KEY.GET_ALL_DATASETS, fetchAllDatasetsData);
}

export default findAllDatasetsData;
