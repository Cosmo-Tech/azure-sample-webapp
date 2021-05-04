// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';
import { DATASET_ENDPOINT, DATASET_ACTIONS_KEY } from '../../../commons/DatasetConstants';

// generators function
export function * fetchAllDatasetsData () {
  // yield keyword is here to milestone and save the action
  const { data } = yield axios.get(DATASET_ENDPOINT.FIND_ALL_DATASETS);
  // Here is an effect named put that indicate to the middleware that it can dispatch a SET_ALL_SCENARIOS action with list as payload
  yield put({ type: DATASET_ACTIONS_KEY.SET_ALL_DATASETS, list: data });
}

// generators function
// Here is a watcher that take EVERY action dispatched named GET_SCENARIO_LIST and bind getAllScenariosData saga to it
function * findAllDatasetsData () {
  yield takeEvery(DATASET_ACTIONS_KEY.GET_ALL_DATASETS, fetchAllDatasetsData);
}

export default findAllDatasetsData;
