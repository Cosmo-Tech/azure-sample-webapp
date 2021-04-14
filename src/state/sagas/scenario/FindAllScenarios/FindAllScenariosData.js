// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import axios from 'axios'
import { put, takeEvery } from 'redux-saga/effects'
import { SCENARIO_ENDPOINT, SCENARIO_ACTIONS_KEY } from '../../../commons/ScenarioConstants'

// generators function
export function * getAllScenariosData () {
  try {
    // yield keyword is here to milestone and save the action
    const { data } = yield axios.get(SCENARIO_ENDPOINT.FIND_ALL_SCENARIOS)
    // Here is an effect named put that indicate to the middleware that it can dispatch a SET_ALL_SCENARIOS action with list as payload
    yield put({ type: SCENARIO_ACTIONS_KEY.SET_ALL_SCENARIOS, list: data })
  } catch (error) {
    console.log(error)
  }
}

// generators function
// Here is a watcher that take EVERY action dispatched named GET_SCENARIO_LIST and bind getAllScenariosData saga to it
function * findAllScenariosData () {
  yield takeEvery(SCENARIO_ACTIONS_KEY.GET_ALL_SCENARIOS, getAllScenariosData)
}

export default findAllScenariosData
