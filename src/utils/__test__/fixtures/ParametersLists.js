// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const DEFAULT_PARAMETERS_LIST = [
  {
    id: 'stock',
    varType: 'int',
    options: null,
  },
  {
    id: 'restock',
    varType: 'int',
    options: null,
  },
  {
    id: 'comment',
    varType: 'string',
    options: null,
  },
  {
    id: 'evaluation',
    varType: 'string',
    options: null,
  },
  {
    id: 'tables',
    varType: 'number',
    options: null,
  },
  {
    id: 'seats',
    varType: 'number',
    options: null,
  },
  {
    id: 'activated',
    varType: 'bool',
    options: null,
  },
  {
    id: 'used',
    varType: 'bool',
    options: null,
  },
  {
    id: 'start_date',
    varType: 'date',
    options: null,
  },
  {
    id: 'end_date',
    varType: 'date',
    options: {
      validation: '> start_date',
    },
  },
];
