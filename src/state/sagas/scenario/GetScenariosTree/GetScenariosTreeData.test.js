// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import SagaTester from 'redux-saga-tester'
import { fetchScenarioTreeData } from './GetScenariosTreeData'
import { scenarioTreeInitialState, scenarioTreeReducer } from '../../../reducers/scenario/ScenarioReducer'
import { SCENARIO_ACTIONS_KEY, SCENARIO_ENDPOINT, SCENARIO_STATUS } from '../../../commons/ScenarioConstants'
import * as axios from 'axios'
import getScenarioTreeSampleTest from './GetScenariosTree.json'

// Mocks
jest.mock('axios')

// Test Constants

const scenarioTreeUpdatedState = {
  data: getScenarioTreeSampleTest,
  status: SCENARIO_STATUS.SUCCESS
}

// Saga tester parameter
const middlewareMeta = 'SCENARIO_SAGA_MIDDLEWARE'
const middleware = store => next => action => next({
  ...action,
  meta: middlewareMeta
})

describe('GetScenariosTreeData saga', () => {
  it('Is working as expected', async () => {
    const sagaTester = new SagaTester(
      {
        scenarioTreeInitialState,
        reducers: [scenarioTreeReducer],
        middlewares: [middleware]
      })

    // define the success returned value of axios.get
    axios.get.mockResolvedValue({ data: getScenarioTreeSampleTest })

    sagaTester.start(fetchScenarioTreeData)

    // Check that state was populated with initialState correctly
    // TODO Did not figure out how to test 'deeply equals' with jest that's why I use the [0] trick...
    expect(sagaTester.getState()[0]).toEqual(scenarioTreeInitialState)

    // Dispatch the event to start the saga
    sagaTester.dispatch({ type: SCENARIO_ACTIONS_KEY.GET_SCENARIO_TREE })

    // Check that the axios.get call has been perform
    expect(axios.get).toHaveBeenCalledWith(SCENARIO_ENDPOINT.GET_SCENARIO_TREE)

    // Wait until the SET_ALL_SCENARIOS is launched
    await sagaTester.waitFor(SCENARIO_ACTIONS_KEY.SET_SCENARIO_TREE)

    // Optional: Check that all actions have the meta property from the middleware
    sagaTester.getCalledActions().forEach(action => {
      expect(action.meta).toEqual(middlewareMeta)
    })

    // Check that the new state was affected by the reducer
    // i.e. that the scenarioList and the status have been updated
    // TODO Did not figure out how to test 'deeply equals' with jest that's why I use the [0] trick...
    expect(sagaTester.getState()[0]).toEqual(scenarioTreeUpdatedState)

    // Check that the saga listens only once
    sagaTester.dispatch({ type: SCENARIO_ACTIONS_KEY.GET_SCENARIO_TREE })
    expect(sagaTester.numCalled(SCENARIO_ACTIONS_KEY.GET_SCENARIO_TREE)).toEqual(2)
    expect(sagaTester.numCalled(SCENARIO_ACTIONS_KEY.SET_SCENARIO_TREE)).toEqual(1)

    // Reset the state and action list, dispatch again
    // and check that it was called
    sagaTester.reset(true)
    expect(sagaTester.wasCalled(SCENARIO_ACTIONS_KEY.GET_SCENARIO_TREE)).toEqual(false)
    sagaTester.dispatch({ type: SCENARIO_ACTIONS_KEY.GET_SCENARIO_TREE })
    expect(sagaTester.wasCalled(SCENARIO_ACTIONS_KEY.GET_SCENARIO_TREE)).toEqual(true)
  })
})
