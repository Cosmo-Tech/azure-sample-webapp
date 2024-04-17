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

export const TWINCACHE_STATUS = {
  EMPTY: 'EMPTY',
  FULL: 'FULL',
  UNKNOWN: 'UNKNOWN',
};

export const INGESTION_STATUS = {
  NONE: 'NONE',
  PENDING: 'PENDING',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
  UNKNOWN: 'UNKNOWN',
};

export const TWINGRAPH_SECTION_URL = '/swagger-ui/index.html#/dataset/twingraphQuery';

export const DATASET_SOURCE_TYPE = {
  ADT: 'ADT',
  AZURE_STORAGE: 'AzureStorage',
  LOCAL_FILE: 'File',
  NONE: 'None',
};

export const DATASET_SOURCES = [
  {
    id: DATASET_SOURCE_TYPE.AZURE_STORAGE,
    labels: { en: 'Graph Format from Azure Storage', fr: 'Format Graph depuis Azure Storage' },
    parameters: [
      { id: `name`, varType: 'string', labels: { en: 'Account name', fr: 'Nom du compte' } },
      { id: `location`, varType: 'string', labels: { en: 'Container name', fr: 'Nom du container' } },
      { id: `path`, varType: 'string', labels: { en: 'Path', fr: 'Chemin' } },
    ],
    tags: ['datasource'],
  },
  {
    id: DATASET_SOURCE_TYPE.ADT,
    labels: { en: 'Azure Digital Twin', fr: 'Azure Digital Twin' },
    parameters: [{ id: `location`, varType: 'string', labels: { en: 'Path', fr: 'Chemin' } }],
    tags: ['datasource'],
  },
  {
    id: DATASET_SOURCE_TYPE.LOCAL_FILE,
    labels: { en: 'Graph Format from Local File', fr: 'Format Graph depuis un fichier local' },
    parameters: [
      { id: `file`, varType: '%DATASETID%', labels: { en: '', fr: '' }, options: { defaultFileTypeFilter: '.zip' } },
    ],
    tags: ['datasource'],
  },
  {
    id: DATASET_SOURCE_TYPE.NONE,
    labels: { en: 'Empty', fr: 'Dataset vide' },
    parameters: [],
    tags: ['datasource'],
  },
];

export const DATASET_PERMISSIONS_MAPPING = {
  viewer: ['read', 'read_security'],
  editor: ['read', 'read_security', 'write'],
  admin: ['read', 'read_security', 'write', 'write_security', 'delete'],
};
