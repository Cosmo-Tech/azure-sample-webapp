// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const DATASET_ID_VARTYPE = '%DATASETID%';
export const RUNNER_RUN_STATE = {
  CREATED: 'Created',
  RUNNING: 'Running',
  SUCCESSFUL: 'Successful',
  FAILED: 'Failed',
  UNKNOWN: 'Unknown',
};
export const RUNNER_VALIDATION_STATUS = {
  DRAFT: 'Draft',
  LOADING: 'Loading', // Client-side only
  REJECTED: 'Rejected',
  VALIDATED: 'Validated',
  UNKNOWN: 'Unknown',
};
export const VALID_MIME_TYPES = [
  'application/json',
  'application/zip',
  'application/x-zip-compressed', // Windows-specific
  'application/xml',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'mats-officedocument.spreadsheetml.sheet',
  'application/x-tika-ooxml',
  'text/csv',
  'text/plain',
  'text/x-yaml',
  'text/yaml',
  'application/x-yaml',
  'application/yaml',
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
  AZURE_STORAGE: 'AzureStorage',
  FILE_UPLOAD: 'FileUploadToDataset',
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
    id: DATASET_SOURCE_TYPE.NONE,
    labels: { en: 'Empty', fr: 'Dataset vide' },
    parameters: [],
    tags: ['datasource'],
  },
  {
    id: DATASET_SOURCE_TYPE.FILE_UPLOAD,
    labels: { en: 'Create dataset from file upload', fr: 'Envoi de fichiers pour créer un dataset' },
    parameters: [{ id: `file`, varType: '%DATASETID%', labels: { en: '', fr: '' } }],
    tags: ['datasource'],
  },
];

export const DATASET_PERMISSIONS_MAPPING = {
  viewer: ['read'],
  editor: ['read', 'read_security', 'write'],
  admin: ['read', 'read_security', 'write', 'write_security', 'delete'],
};
