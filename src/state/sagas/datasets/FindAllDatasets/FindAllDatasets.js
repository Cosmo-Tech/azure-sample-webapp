// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { call, put, takeEvery } from 'redux-saga/effects';
import { DATASET_ACTIONS_KEY } from '../../../commons/DatasetConstants';
import { ORGANIZATION_ID } from '../../../../config/AppInstance';
import { Api } from '../../../../services/config/Api';
import { STATUSES } from '../../../commons/Constants';

export function * fetchAllDatasetsData () {
  try {
    const { data } = yield call(Api.Datasets.findAllDatasets, ORGANIZATION_ID);
    yield put({
      type: DATASET_ACTIONS_KEY.SET_ALL_DATASETS,
      list: data,
      status: STATUSES.SUCCESS
    });
  } catch (e) {
    console.error(e);
  }
}

function * findAllDatasetsData () {
  yield takeEvery(DATASET_ACTIONS_KEY.GET_ALL_DATASETS, fetchAllDatasetsData);
}

export default findAllDatasetsData;
