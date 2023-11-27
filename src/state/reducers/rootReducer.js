// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { combineReducers } from 'redux';
import { scenarioReducer } from './scenario/ScenarioReducer';
import { scenarioRunReducer } from './scenariorun/ScenarioRunReducer';
import { applicationReducer } from './app/ApplicationReducer';
import { datasetsReducer } from './dataset/DatasetsReducer';
import { workspaceReducer } from './workspace/WorkspaceReducer';
import { organizationReducer } from './organization/OrganizationReducer';
import { solutionReducer } from './solution/SolutionReducer';
import { authReducer } from './auth/AuthReducer';
import { powerBiReducer } from './powerbi/PowerBIReducer';

const rootReducer = combineReducers({
  scenario: scenarioReducer,
  scenarioRun: scenarioRunReducer,
  application: applicationReducer,
  auth: authReducer,
  dataset: datasetsReducer,
  workspace: workspaceReducer,
  organization: organizationReducer,
  solution: solutionReducer,
  powerBI: powerBiReducer,
});

export default rootReducer;
