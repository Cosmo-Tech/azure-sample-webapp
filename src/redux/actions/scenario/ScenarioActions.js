// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// Redux Action (equivalent to dispatch function)
import { SCENARIO_ACTIONS_KEY } from '../../commons/ScenarioConstants'

export const getScenarioListAction = (payLoad) => ({
  type: SCENARIO_ACTIONS_KEY.GET_SCENARIO_LIST,
  ...payLoad
})
