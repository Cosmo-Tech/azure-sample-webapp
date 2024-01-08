// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// Legacy dataset with API v2.x structure
export const LEGACY_DATASET_V2 = {
  id: 'D-stbdefault',
  name: 'Demo Brewery ADT reference',
  description: 'Brewery reference model in ADT',
  ownerId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  tags: ['ADT', 'Brewery', 'Reference', 'dataset'],
  connector: {
    id: 'c-pn2e3l74g9pd',
    name: 'ADT Connector',
    version: '2.3.3',
    parametersValues: { AZURE_DIGITAL_TWINS_URL: 'https://o-gzypnd27g7-demobrewery.api.weu.digitaltwins.azure.net' },
  },
  fragmentsIds: null,
  validatorId: null,
  compatibility: null,
};

export const DEFAULT_DATASET = {
  organizationId: 'O-stbdorgztn',
  parentId: null,
  twingraphId: 't-stbdtwngrph',
  main: false,
  id: 'D-stbdefault',
  name: 'Local file dataset',
  description: 'Local file dataset description',
  ownerId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  ownerName: 'Dave Lauper',
  tags: ['File', 'Brewery'],
  sourceType: 'File',
  source: { location: 'none', name: null, path: null, jobId: null },
  status: 'READY',
  connector: {
    id: 'c-q1vjg10e5ej',
    name: 'TwincacheConnector 0.4.1',
    version: '0.4.1',
    parametersValues: { TWIN_CACHE_NAME: 't-95j9q5jw17q' },
  },
  fragmentsIds: null,
  validatorId: null,
  compatibility: null,
  creationDate: null,
  refreshDate: null,
  queries: null,
  security: null,
};

export const ACTUAL_ADT_INSTANCE_DATASET = {
  id: 'D-4jwyQnmv7jx',
  name: 'Demo Brewery ADT reference',
  description: 'Brewery reference model in ADT',
  ownerId: '3a869905-e9f5-4851-a7a9-3079aad49dff',
  tags: ['ADT', 'Brewery', 'Reference', 'dataset'],
  connector: {
    id: 'c-pn2e3l74g9pd',
    name: 'ADT Connector',
    version: '2.3.3',
    parametersValues: { AZURE_DIGITAL_TWINS_URL: 'https://o-gzypnd27g7-demobrewery.api.weu.digitaltwins.azure.net' },
  },
  fragmentsIds: null,
  validatorId: null,
  compatibility: null,
};

export const DEFAULT_DATASETS_LIST = [ACTUAL_ADT_INSTANCE_DATASET];
