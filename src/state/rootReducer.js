// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { combineReducers } from 'redux';
import applicationReducer from './app/reducers';
import authReducer from './auth/reducers';
import datasetTwingraphQueriesResultsReducer from './datasetTwingraph/reducers';
import datasetsReducer from './datasets/reducers';
import organizationReducer from './organizations/reducers';
import powerBiReducer from './powerBi/reducers';
import runnerReducer from './runner/reducers';
import solutionReducer from './solutions/reducers';
import workspaceReducer from './workspaces/reducers';

const rootReducer = combineReducers({
  runner: runnerReducer,
  application: applicationReducer,
  auth: authReducer,
  dataset: datasetsReducer,
  datasetTwingraph: datasetTwingraphQueriesResultsReducer,
  workspace: workspaceReducer,
  organization: organizationReducer,
  solution: solutionReducer,
  powerBI: powerBiReducer,
});

export default rootReducer;
