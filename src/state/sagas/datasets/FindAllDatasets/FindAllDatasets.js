// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { call, put, takeEvery } from 'redux-saga/effects';
import { DATASET_ACTIONS_KEY } from '../../../commons/DatasetConstants';
import { ORGANIZATION_ID } from '../../../../configs/App.config';
import DatasetService from '../../../../services/dataset/DatasetService';

// generators function
export function * fetchAllDatasetsData () {
  // yield keyword is here to milestone and save the action
  const { error, data } = yield call(DatasetService.findAllDatasets, ORGANIZATION_ID);
  if (error) {
    // TODO handle error management
  } else {
    // Here is an effect named put that indicate to the middleware that it can dispatch a SET_ALL_DATASETS action with list as payload
    yield put({ type: DATASET_ACTIONS_KEY.SET_ALL_DATASETS, list: data });
  }
}

// generators function
// Here is a watcher that takes EVERY action dispatched named GET_ALL_DATASETS and binds fetchAllDatasetsData saga to it
function * findAllDatasetsData () {
  yield takeEvery(DATASET_ACTIONS_KEY.GET_ALL_DATASETS, fetchAllDatasetsData);
}

export default findAllDatasetsData;
