// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { combineReducers } from 'redux';
import { scenarioReducer } from './scenario/ScenarioReducer';
import { applicationReducer } from './app/ApplicationReducer';
import { datasetReducer } from './dataset/DatasetReducer';
import { workspaceReducer } from './workspace/WorkspaceReducer';
import { solutionReducer } from './solution/SolutionReducer';
import { authReducer } from './auth/AuthReducer';
import { runTemplateReducer } from './runtemplate/RunTemplateReducer';
import { powerBiReducer } from './powerbi/PowerBIReducer';

const rootReducer = combineReducers(
  {
    scenario: scenarioReducer,
    application: applicationReducer,
    auth: authReducer,
    dataset: datasetReducer,
    workspace: workspaceReducer,
    solution: solutionReducer,
    runTemplate: runTemplateReducer,
    powerBI: powerBiReducer
  }
);

export default rootReducer;
