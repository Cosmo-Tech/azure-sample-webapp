// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const DATASET_ACTIONS_KEY = {
  GET_ALL_DATASETS: 'GET_ALL_DATASETS',
  DELETE_DATASET: 'DELETE_DATASET',
  CREATE_DATASET: 'CREATE_DATASET',
  UPDATE_DATASET: 'UPDATE_DATASET',
  REFRESH_DATASET: 'REFRESH_DATASET',
  START_TWINGRAPH_STATUS_POLLING: 'START_TWINGRAPH_STATUS_POLLING',
  ROLLBACK_TWINGRAPH_DATA: 'ROLLBACK_TWINGRAPH_DATA',
  UPDATE_DATASET_SECURITY: 'UPDATE_DATASET_SECURITY,',
};

export const DATASET_PERMISSIONS_MAPPING = {
  viewer: ['read'],
  editor: ['read', 'read_security', 'write'],
  admin: ['read', 'read_security', 'write', 'write_security', 'delete'],
};
