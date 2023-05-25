// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const DEFAULT_DATASET = {
  id: 'D-stbdefault',
  name: 'Brewery Baby Dataset ADT',
  description: 'Brewery reference model in ADT',
  ownerId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  tags: ['ADT', 'Brewery', 'Reference', 'dataset'],
  connector: {
    id: 'c-dnv2kdogy2kn',
    name: 'Brewery Baby Connector ADT',
    version: '2.5.1',
    parametersValues: {
      AZURE_DIGITAL_TWINS_URL: 'https://o-qemo3e7y75mk-brewerybabydeploy.api.eus2.digitaltwins.azure.net',
    },
  },
  fragmentsIds: null,
  validatorId: null,
  compatibility: null,
};

export const ACTUAL_ADT_INSTANCE_DATASET = {
  id: 'd-wk6xmgd7meq8',
  name: 'Brewery Baby Dataset ADT',
  description: 'Brewery reference model in ADT',
  ownerId: '3a869905-e9f5-4851-a7a9-3079aad49dff',
  tags: ['ADT', 'Brewery', 'Reference', 'dataset'],
  connector: {
    id: 'c-dnv2kdogy2kn',
    name: 'Brewery Baby Connector ADT',
    version: '2.5.1',
    parametersValues: {
      AZURE_DIGITAL_TWINS_URL: 'https://o-qemo3e7y75mk-brewerybabydeploy.api.eus2.digitaltwins.azure.net',
    },
  },
  fragmentsIds: null,
  validatorId: null,
  compatibility: null,
};

export const DEFAULT_DATASETS_LIST = [ACTUAL_ADT_INSTANCE_DATASET];
