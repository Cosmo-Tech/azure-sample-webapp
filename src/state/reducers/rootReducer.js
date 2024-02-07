// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { combineReducers } from 'redux';
import { applicationReducer } from './app/ApplicationReducer';
import { authReducer } from './auth/AuthReducer';
import { datasetsReducer } from './dataset/DatasetsReducer';
// eslint-disable-next-line max-len
import { datasetTwingraphQueriesResultsReducer } from './datasetTwingraphQueriesResults/DatasetTwingraphQueriesResultsReducer';
import { organizationReducer } from './organization/OrganizationReducer';
import { powerBiReducer } from './powerbi/PowerBIReducer';
import { scenarioReducer } from './scenario/ScenarioReducer';
import { scenarioRunReducer } from './scenariorun/ScenarioRunReducer';
import { solutionReducer } from './solution/SolutionReducer';
import { workspaceReducer } from './workspace/WorkspaceReducer';

const rootReducer = combineReducers({
  scenario: scenarioReducer,
  scenarioRun: scenarioRunReducer,
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
