// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { combineReducers } from 'redux';
import { scenarioReducer } from './scenario/ScenarioReducer';
import { applicationReducer } from './app/ApplicationReducer';
import { datasetReducer } from './dataset/DatasetReducer';
import { authReducer } from './auth/AuthReducer';

const rootReducer = combineReducers({
  scenario: scenarioReducer,
  application: applicationReducer,
  auth: authReducer,
  dataset: datasetReducer
});

export default rootReducer;
