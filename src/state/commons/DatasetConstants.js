// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const DATASET_ACTIONS_KEY = {
  GET_ALL_DATASETS: 'GET_ALL_DATASETS',
  SET_ALL_DATASETS: 'SET_ALL_DATASETS',
  SET_DATASET_SECURITY: 'SET_DATASET_SECURITY',
  ADD_DATASET: 'ADD_DATASET',
  SELECT_DATASET: 'SELECT_DATASET',
  SELECT_DEFAULT_DATASET: 'SELECT_DEFAULT_DATASET',
  TRIGGER_SAGA_DELETE_DATASET: 'TRIGGER_SAGA_DELETE_DATASET',
  DELETE_DATASET: 'DELETE_DATASET',
  CREATE_DATASET: 'CREATE_DATASET',
  UPDATE_DATASET: 'UPDATE_DATASET',
  TRIGGER_SAGA_UPDATE_DATASET: 'TRIGGER_SAGA_UPDATE_DATASET',
  TRIGGER_SAGA_REFRESH_DATASET: 'TRIGGER_SAGA_REFRESH_DATASET',
  TRIGGER_SAGA_START_TWINGRAPH_STATUS_POLLING: 'TRIGGER_SAGA_START_TWINGRAPH_STATUS_POLLING',
  TRIGGER_SAGA_ROLLBACK_TWINGRAPH_DATA: 'TRIGGER_SAGA_ROLLBACK_TWINGRAPH_DATA',
  TRIGGER_SAGA_UPDATE_DATASET_SECURITY: 'TRIGGER_SAGA_UPDATE_DATASET_SECURITY,',
};

export const DATASET_TWINGRAPH_QUERIES_RESULTS_ACTIONS = {
  INITIALIZE: 'INITIALIZE_DATASET_TWINGRAPH_QUERIES_RESULTS',
  WAITING: 'WAIT_DATASET_TWINGRAPH_QUERIES_RESULTS',
  PROCESS: 'PROCESS_DATASET_TWINGRAPH_QUERY_RESULT',
  RESET: 'RESET_DATASET_TWINGRAPH_QUERIES_RESULTS',
};
export const DATASET_PERMISSIONS_MAPPING = {
  viewer: ['read'],
  editor: ['read', 'read_security', 'write'],
  admin: ['read', 'read_security', 'write', 'write_security', 'delete'],
};
