// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { combineReducers } from 'redux'
import { scenarioReducer } from './scenario/ScenarioReducer'

const rootReducer = combineReducers({ scenario: scenarioReducer })

export default rootReducer
