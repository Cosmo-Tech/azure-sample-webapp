// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const DEFAULT_PARAMETERS_LIST = [
  {
    id: 'stock',
    varType: 'int',
    additionalData: null,
  },
  {
    id: 'restock',
    varType: 'int',
    additionalData: null,
  },
  {
    id: 'comment',
    varType: 'string',
    additionalData: null,
  },
  {
    id: 'evaluation',
    varType: 'string',
    additionalData: null,
  },
  {
    id: 'tables',
    varType: 'number',
    additionalData: null,
  },
  {
    id: 'seats',
    varType: 'number',
    additionalData: null,
  },
  {
    id: 'activated',
    varType: 'bool',
    additionalData: null,
  },
  {
    id: 'used',
    varType: 'bool',
    additionalData: null,
  },
  {
    id: 'start_date',
    varType: 'date',
    additionalData: null,
  },
  {
    id: 'end_date',
    varType: 'date',
    additionalData: {
      validation: '> start_date',
    },
  },
];
