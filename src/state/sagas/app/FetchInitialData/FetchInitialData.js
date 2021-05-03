// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { put, takeEvery, call } from 'redux-saga/effects';
import { APPLICATION_ACTIONS_KEY } from '../../../commons/ApplicationConstants';
import { STATUSES } from '../../../commons/Constants';
import { getAllScenariosData } from '../../scenario/FindAllScenarios/FindAllScenariosData';
import { fetchAllDatasetsData } from '../../datasets/FindAllDatasets/FindAllDatasets';
import { fetchScenarioTreeData } from '../../scenario/GetScenariosTree/GetScenariosTreeData';

// generators function
export function * fetchAllInitialData () {
  try {
    yield put({ type: APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS, status: STATUSES.LOADING });
    // Fetch all scenarios
    yield call(getAllScenariosData);
    yield call(fetchScenarioTreeData);
    yield call(fetchAllDatasetsData);
    yield put({ type: APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS, status: STATUSES.SUCCESS });
  } catch (error) {
    yield put({ type: APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS, status: STATUSES.ERROR });
  }
}

// generators function
// Here is a watcher that take EVERY action dispatched named GET_SCENARIO_LIST and bind getAllScenariosData saga to it
function * getAllInitialData () {
  yield takeEvery(APPLICATION_ACTIONS_KEY.GET_ALL_INITIAL_DATA, fetchAllInitialData);
}

export default getAllInitialData;
