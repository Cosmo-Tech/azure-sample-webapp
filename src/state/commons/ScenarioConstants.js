// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// Available scenario statuses
export const SCENARIO_STATUS = {
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  IDLE: 'IDLE'
};

// Available scenario endpoints
export const SCENARIO_ENDPOINT = {
  FIND_ALL_SCENARIOS: '/api/FindAllScenarios',
  GET_SCENARIO_TREE: '/api/GetScenariosTree'
};

// Available scenario actions
export const SCENARIO_ACTIONS_KEY = {
  GET_ALL_SCENARIOS: 'GET_ALL_SCENARIOS',
  SET_ALL_SCENARIOS: 'SET_ALL_SCENARIOS',
  GET_SCENARIO_TREE: 'GET_SCENARIO_TREE',
  SET_SCENARIO_TREE: 'SET_SCENARIO_TREE',
  GET_CURRENT_SCENARIO: 'GET_CURRENT_SCENARIO',
  SET_CURRENT_SCENARIO: 'SET_CURRENT_SCENARIO'
};
