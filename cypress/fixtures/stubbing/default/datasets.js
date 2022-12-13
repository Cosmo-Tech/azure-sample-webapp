// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const DEFAULT_DATASET = {
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
