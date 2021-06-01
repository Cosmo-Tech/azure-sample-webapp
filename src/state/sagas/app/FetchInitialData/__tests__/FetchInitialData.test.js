// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import * as axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import SagaTester from 'redux-saga-tester';
import { applicationInitialState, applicationReducer } from '../../../../reducers/app/ApplicationReducer';
import getAllInitialData from '../FetchInitialData';
import { APPLICATION_ACTIONS_KEY } from '../../../../commons/ApplicationConstants';
import { STATUSES } from '../../../../commons/Constants';
import { SCENARIO_ENDPOINT } from '../../../../commons/ScenarioConstants';
import findAllScenarioSampleTest from '../../../scenario/FindAllScenarios/__tests__/FindAllScenarios.json';

// Mocks
const mock = new MockAdapter(axios);

// Saga tester parameter
const middlewareMeta = 'APP_SAGA_MIDDLEWARE';
const middleware = store => next => action => next({
  ...action,
  meta: middlewareMeta
});

const applicationLoadingState = {
  status: STATUSES.LOADING
};

describe('FetchInitialData saga', () => {
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('Is working as expected', async () => {
    // define mocks on axios.get calls
    mock.onGet(SCENARIO_ENDPOINT.FIND_ALL_SCENARIOS).reply(200, { data: findAllScenarioSampleTest });

    const sagaTester = new SagaTester(
      {
        applicationInitialState,
        reducers: [applicationReducer],
        middlewares: [middleware]
      });

    sagaTester.start(getAllInitialData);

    // Check that state was populated with initialState correctly
    // TODO Did not figure out how to test 'deeply equals' with jest that's why I use the [0] trick...
    expect(sagaTester.getState()[0]).toEqual(applicationInitialState);

    // Dispatch the event to start the saga
    sagaTester.dispatch({ type: APPLICATION_ACTIONS_KEY.GET_ALL_INITIAL_DATA });

    // Wait until the SET_APPLICATION_STATUS is launched
    await sagaTester.waitFor(APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS);

    expect(sagaTester.getState()[0]).toEqual(applicationLoadingState);

    // Check that the saga listens only once
    sagaTester.dispatch({ type: APPLICATION_ACTIONS_KEY.GET_ALL_INITIAL_DATA });
    expect(sagaTester.numCalled(APPLICATION_ACTIONS_KEY.GET_ALL_INITIAL_DATA)).toEqual(2);
    expect(sagaTester.numCalled(APPLICATION_ACTIONS_KEY.SET_APPLICATION_STATUS)).toEqual(2);

    sagaTester.reset(true);
    expect(sagaTester.wasCalled(APPLICATION_ACTIONS_KEY.GET_ALL_INITIAL_DATA)).toEqual(false);
    sagaTester.dispatch({ type: APPLICATION_ACTIONS_KEY.GET_ALL_INITIAL_DATA });
    expect(sagaTester.wasCalled(APPLICATION_ACTIONS_KEY.GET_ALL_INITIAL_DATA)).toEqual(true);
  });
});
