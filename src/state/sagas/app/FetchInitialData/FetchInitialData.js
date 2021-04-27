// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { put, takeEvery, call } from 'redux-saga/effects'
import { APPLICATION_ACTIONS_KEY, APPLICATION_STATUS } from '../../../commons/ApplicationConstants'
import { getAllScenariosData } from '../../scenario/FindAllScenarios/FindAllScenariosData'
import { fetchScenarioTreeData } from '../../scenario/GetScenariosTree/GetScenariosTreeData'

// generators function
export function * fetchAllInitialData () {
  try {
    yield put({ type: APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS, status: APPLICATION_STATUS.LOADING })
    // Fetch all scenarios
    yield call(getAllScenariosData)
    yield call(fetchScenarioTreeData)
    yield put({ type: APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS, status: APPLICATION_STATUS.READY })
  } catch (error) {
    yield put({ type: APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS, status: APPLICATION_STATUS.ERROR })
  }
}

// generators function
// Here is a watcher that take EVERY action dispatched named GET_SCENARIO_LIST and bind getAllScenariosData saga to it
function * getAllInitialData () {
  yield takeEvery(APPLICATION_ACTIONS_KEY.GET_ALL_INITIAL_DATA, fetchAllInitialData)
}

export default getAllInitialData
