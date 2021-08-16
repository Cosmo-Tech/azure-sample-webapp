// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const PARAMETERS = {
  stock: {
    defaultValue: 1000
  },
  restock_qty: {
    defaultValue: 200
  },
  nb_waiters: {
    defaultValue: 5
  },
  currency: {
    defaultValue: 'USD'
  },
  currency_name: {
    defaultValue: 'EUR'
  },
  currency_value: {
    defaultValue: 1000
  },
  currency_used: {
    defaultValue: false
  },
  start_date: {
    defaultValue: new Date()
  }
};

export const SCENARIO_PARAMETERS_CONFIG = {
  parameters: PARAMETERS
};

// Bar Tab parameters
export const STOCK_PARAM = {
  id: 'stock',
  varType: 'int',
  defaultValue: 100
};
export const RESTOCK_PARAM = {
  id: 'restock_qty',
  varType: 'int',
  defaultValue: 25
};
export const NBWAITERS_PARAM = {
  id: 'nb_waiters',
  varType: 'int',
  defaultValue: 5
};

// Basic Types Tab parameters
export const CURRENCY_PARAM = {
  id: 'currency',
  varType: 'enum',
  defaultValue: 'USD'
};
export const CURRENCY_NAME_PARAM = {
  id: 'currency_name',
  varType: 'string',
  defaultValue: 'EUR'
};
export const CURRENCY_VALUE_PARAM = {
  id: 'currency_value',
  varType: 'number',
  defaultValue: 1000
};
export const CURRENCY_USED_PARAM = {
  id: 'currency_used',
  varType: 'bool',
  defaultValue: false
};
export const START_DATE_PARAM = {
  id: 'start_date',
  varType: 'date',
  defaultValue: new Date('2014-08-18T21:11:54')
};

// Dataset part (file) tab parameter
export const INITIAL_STOCK_PARAM = {
  id: 'initial_stock_dataset',
  description: 'Initial stock dataset part',
  varType: '%DATASETID%',
  connectorId: 'C-XPv4LBVGAL',
  defaultFileTypeFilter: '.zip,.csv,.json,.xls,.xlsx'
};

// runTemplate id to name mapping :
// '1' -> Run template with Brewery parameters
// '2' -> Run template without parameters
// '3' -> Run template with mock basic types
export const SCENARIO_PARAMETERS_TABS_CONFIG = [
  {
    id: 0,
    translationKey: 'commoncomponents.tab.scenario.parameters.upload.file',
    label: 'Upload File template',
    value: 'upload_file_template',
    runTemplateIds: ['3']
  },
  {
    id: 1,
    translationKey: 'commoncomponents.tab.scenario.parameters.bar',
    label: 'Bar parameters',
    value: 'bar_parameters',
    runTemplateIds: ['1']
  },
  {
    id: 2,
    translationKey: 'commoncomponents.tab.scenario.parameters.basic.types',
    label: 'Basic Types template',
    value: 'basic_types',
    runTemplateIds: ['3']
  },
  {
    id: 3,
    translationKey: 'commoncomponents.tab.scenario.parameters.array.template',
    label: 'Array Template',
    value: 'array_template',
    runTemplateIds: []
  }
];
