// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const CONNECTOR_VERSION_AZURE_STORAGE = '1.1.1';
export const CONNECTOR_NAME_AZURE_STORAGE = 'Azure Storage Connector';
export const CONNECTOR_NAME_ADT = 'ADT Connector';
export const DATASET_ID_VARTYPE = '%DATASETID%';
export const SCENARIO_RUN_STATE = {
  CREATED: 'Created',
  RUNNING: 'Running',
  SUCCESSFUL: 'Successful',
  FAILED: 'Failed',
  DATA_INGESTION_IN_PROGRESS: 'DataIngestionInProgress',
  UNKNOWN: 'Unknown',
};
export const SCENARIO_VALIDATION_STATUS = {
  DRAFT: 'Draft',
  LOADING: 'Loading', // Client-side only
  REJECTED: 'Rejected',
  VALIDATED: 'Validated',
  UNKNOWN: 'Unknown',
};
export const STORAGE_ROOT_DIR_PLACEHOLDER = '%WORKSPACE_FILE%/';
export const VALID_MIME_TYPES = [
  'application/json',
  'application/zip',
  'application/xml',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'mats-officedocument.spreadsheetml.sheet',
  'application/x-tika-ooxml',
  'text/csv',
  'text/plain',
  'text/x-yaml',
];

export const TWINGRAPH_STATUS = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  ERROR: 'ERROR',
  READY: 'READY',
  UNKNOWN: 'UNKNOWN',
};

export const DATASET_SOURCE_TYPE = {
  ADT: 'ADT',
  AZURE_STORAGE: 'AzureStorage',
  LOCAL_FILE: 'File',
};

export const TWINGRAPH_SECTION_URL = '/swagger-ui/index.html#/dataset/twingraphQuery';
