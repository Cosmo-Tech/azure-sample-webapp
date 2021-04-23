// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { combineReducers } from 'redux';
import { scenarioReducer } from './scenario/ScenarioReducer';
import { applicationReducer } from './app/ApplicationReducer';

const rootReducer = combineReducers({ scenario: scenarioReducer, application: applicationReducer });

export default rootReducer;
