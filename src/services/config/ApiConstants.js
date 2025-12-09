// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const DB_DATASET_PART_ID_VARTYPE = '%DATASET_PART_ID_DB%';
export const FILE_DATASET_PART_ID_VARTYPE = '%DATASET_PART_ID_FILE%';

export const RUNNER_RUN_STATE = {
  CREATED: 'NotStarted',
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

export const TWINGRAPH_SECTION_URL = '/swagger-ui/index.html#/dataset/twingraphQuery';

export const NATIVE_DATASOURCE_TYPES = {
  FILE_UPLOAD: 'FileUploadToDataset',
  NONE: 'None',
};

export const DATASET_SOURCES = [
  {
    id: NATIVE_DATASOURCE_TYPES.NONE,
    labels: { en: 'Empty', fr: 'Dataset vide' },
    parameters: [],
    tags: ['datasource'],
  },
  {
    id: NATIVE_DATASOURCE_TYPES.FILE_UPLOAD,
    labels: { en: 'Create dataset from file upload', fr: 'Envoi de fichiers pour créer un dataset' },
    parameters: [{ id: `file`, varType: FILE_DATASET_PART_ID_VARTYPE, labels: { en: '', fr: '' } }],
    tags: ['datasource'],
  },
];

export const DATASET_PERMISSIONS_MAPPING = {
  viewer: ['read'],
  editor: ['read', 'read_security', 'write'],
  admin: ['read', 'read_security', 'write', 'write_security', 'delete'],
};
