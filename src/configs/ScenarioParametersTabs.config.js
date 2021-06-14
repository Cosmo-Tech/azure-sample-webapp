// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const SCENARIO_PARAMETERS_TABS_CONFIG = [
  {
    id: 0,
    translationKey: 'commoncomponents.tab.scenario.parameters.upload.file',
    label: 'Upload File template',
    value: 'upload_file_template',
    runTemplateIds: ['1', '2', '3', '4']
  },
  {
    id: 1,
    translationKey: 'commoncomponents.tab.scenario.parameters.bar',
    label: 'Bar parameters',
    value: 'bar_parameters',
    runTemplateIds: ['1', '2']
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
