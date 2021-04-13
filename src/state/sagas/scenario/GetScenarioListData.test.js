// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import SagaTester from 'redux-saga-tester'
import { scenarioListData } from './GetScenarioListData'
import { scenarioListInitialState, scenarioListReducer } from '../../reducers/scenario/ScenarioReducer'
import { SCENARIO_ACTIONS_KEY, SCENARIO_ENDPOINT, SCENARIO_STATUS } from '../../commons/ScenarioConstants'
import * as axios from 'axios'

// Mocks
jest.mock('axios')

// Test Constants
const scenarioList = [
  {
    id: '1',
    name: 'Scenario1'
  },
  {
    id: '2',
    name: 'Scenario2'
  }
]

const scenarioListMockData = {
  list: scenarioList
}

const scenarioListUpdatedState = {
  list: scenarioList,
  status: SCENARIO_STATUS.SUCCESS
}

// Saga tester parameter
const middlewareMeta = 'SCENARIO_SAGA_MIDDLEWARE'
const middleware = store => next => action => next({
  ...action,
  meta: middlewareMeta
})

describe('GetScenarioListData saga', () => {
  it('Is working as expected', async () => {
    const sagaTester = new SagaTester(
      {
        scenarioListInitialState,
        reducers: [scenarioListReducer],
        middlewares: [middleware]
      })

    // define the success returned value of axios.get
    axios.get.mockResolvedValue({ data: scenarioListMockData })

    sagaTester.start(scenarioListData)

    // Check that state was populated with initialState correctly
    // TODO Did not figure out how to test 'deeply equals' with jest that's why I use the [0] trick...
    expect(sagaTester.getState()[0]).toEqual(scenarioListInitialState)

    // Dispatch the event to start the saga
    sagaTester.dispatch({ type: SCENARIO_ACTIONS_KEY.GET_SCENARIO_LIST })

    // Check that the axios.get call has been perform
    expect(axios.get).toHaveBeenCalledWith(SCENARIO_ENDPOINT.GET_SCENARIO_LIST)

    // Wait until the SET_SCENARIO_LIST is launched
    await sagaTester.waitFor(SCENARIO_ACTIONS_KEY.SET_SCENARIO_LIST)

    // Optional: Check that all actions have the meta property from the middleware
    sagaTester.getCalledActions().forEach(action => {
      expect(action.meta).toEqual(middlewareMeta)
    })

    // Check that the new state was affected by the reducer
    // i.e. that the scenarioList and the status have been updated
    // TODO Did not figure out how to test 'deeply equals' with jest that's why I use the [0] trick...
    expect(sagaTester.getState()[0]).toEqual(scenarioListUpdatedState)

    // Check that the saga listens only once
    sagaTester.dispatch({ type: SCENARIO_ACTIONS_KEY.GET_SCENARIO_LIST })
    expect(sagaTester.numCalled(SCENARIO_ACTIONS_KEY.GET_SCENARIO_LIST)).toEqual(2)
    expect(sagaTester.numCalled(SCENARIO_ACTIONS_KEY.SET_SCENARIO_LIST)).toEqual(1)

    // Reset the state and action list, dispatch again
    // and check that it was called
    sagaTester.reset(true)
    expect(sagaTester.wasCalled(SCENARIO_ACTIONS_KEY.GET_SCENARIO_LIST)).toEqual(false)
    sagaTester.dispatch({ type: SCENARIO_ACTIONS_KEY.GET_SCENARIO_LIST })
    expect(sagaTester.wasCalled(SCENARIO_ACTIONS_KEY.GET_SCENARIO_LIST)).toEqual(true)
  })
})
