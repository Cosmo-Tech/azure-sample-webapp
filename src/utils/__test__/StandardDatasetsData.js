// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const STANDARD_DATASETS = [
  {
    id: 'dataset1',
    name: 'Dataset 1',
    description: 'Dataset description',
    ownerId: '00000000-0000-0000-0000-000000000000',
    fragmentsIds: null,
    validatorId: null,
    compatibility: null,
    tags: [],
    connector: {
      id: 'c-0000000000000',
      name: 'ADT Connector',
      version: '2.3.0',
      parametersValues: {
        AZURE_STORAGE_CONTAINER_BLOB_PREFIX: '%WORKSPACE_FILE%/datasets/dataset1/dataset.csv',
      },
    },
  },
  {
    id: 'dataset2',
    name: 'Dataset 2',
    description: 'Dataset description',
    ownerId: '00000000-0000-0000-0000-000000000000',
    fragmentsIds: null,
    validatorId: null,
    compatibility: null,
    tags: [],
    connector: {
      id: 'c-0000000000000',
      name: 'ADT Connector',
      version: '2.3.0',
      parametersValues: {
        AZURE_STORAGE_CONTAINER_BLOB_PREFIX: '%WORKSPACE_FILE%/datasets/dataset2/dataset.csv',
      },
    },
  },
  {
    id: 'dataset3',
    name: 'Dataset 3',
    description: 'Dataset description',
    ownerId: '00000000-0000-0000-0000-000000000000',
    fragmentsIds: null,
    validatorId: null,
    compatibility: null,
    tags: [],
    connector: {
      id: 'c-0000000000000',
      name: 'ADT Connector',
      version: '2.3.0',
      parametersValues: {
        AZURE_STORAGE_CONTAINER_BLOB_PREFIX: '%WORKSPACE_FILE%/datasets/dataset3/dataset.csv',
      },
    },
  },
];
