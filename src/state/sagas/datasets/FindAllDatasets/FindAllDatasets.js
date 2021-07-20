// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { call, put, takeEvery } from 'redux-saga/effects';
import { DATASET_ACTIONS_KEY } from '../../../commons/DatasetConstants';
import { ORGANIZATION_ID } from '../../../../configs/App.config';
import DatasetService from '../../../../services/dataset/DatasetService';

// generators function
export function * fetchAllDatasetsData () {
  try { // yield keyword is here to milestone and save the action
    const datasetList = yield call(DatasetService.findAllDatasets, ORGANIZATION_ID);
    yield put({ type: DATASET_ACTIONS_KEY.SET_ALL_DATASETS, list: datasetList });
  } catch (e) {
    console.error(e);
  }
}

// generators function
// Here is a watcher that takes EVERY action dispatched named GET_ALL_DATASETS and binds fetchAllDatasetsData saga to it
function * findAllDatasetsData () {
  yield takeEvery(DATASET_ACTIONS_KEY.GET_ALL_DATASETS, fetchAllDatasetsData);
}

export default findAllDatasetsData;
