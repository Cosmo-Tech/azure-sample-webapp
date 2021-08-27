// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// Use the PARAMETERS dict below to override or add information to the scenario parameters defined in your solution
// description, such as:
//  - a default value for each scenario parameter on scenario creation
//  - lists of possible values for "enum" parameters
//  - translation labels
const PARAMETERS = {
  nb_waiters: {
    dataCy: 'waiters-input',
    defaultValue: 5
  },
  restock_qty: {
    dataCy: 'restock-input',
    defaultValue: 25
  },
  stock: {
    dataCy: 'stock-input',
    defaultValue: 100
  },
  currency: {
    defaultValue: 'USD',
    enumValues: [
      {
        key: 'USD',
        value: '$'
      },
      {
        key: 'EUR',
        value: '€'
      },
      {
        key: 'BTC',
        value: '฿'
      },
      {
        key: 'JPY',
        value: '¥'
      }
    ]
  },
  currency_name: {
    defaultValue: 'EUR'
  },
  currency_value: {
    defaultValue: 1000
  },
  currency_used: {
    labels: {
      en: 'Use currency',
      fr: 'Activer la monnaie'
    },
    defaultValue: false
  },
  start_date: {
    defaultValue: new Date('2014-08-18T21:11:54')
  }
};

// Use the PARAMETERS_GROUPS dict below to override or add information to the parameters groups defined in your solution
// description, such as:
//  - translation labels
//  - list and order of the parameters of a group
// You can also create new groups that were not defined in the solution description: in this case don't forget to assign
// these parameters groups to a run template in the RUN_TEMPLATES dict
const PARAMETERS_GROUPS = {
  bar_parameters: {
    labels: {
      en: 'My pub',
      fr: 'Mon bar'
    },
    parameters: [
      'stock',
      'restock_qty',
      'nb_waiters',
      'initial_stock_dataset'
    ]
  },
  basic_types: {
    parameters: [
      'currency',
      'currency_name',
      'currency_value',
      'currency_used',
      'start_date'
    ]
  },
  file_upload: {
    labels: {
      en: 'File upload',
      fr: 'Upload de fichier'
    },
    parameters: [
      'initial_stock_dataset'
    ]
  }
};

// Use RUN_TEMPLATES dict below to override information of the run templates defined in your solution description, such
// as:
//  - list and order of the parameters group to display for this run template
const RUN_TEMPLATES = {
  3: {
    // Use 'parameterGroups' instead of 'parametersGroups' in the run templates description to be consistent
    // with back-end format
    parameterGroups: [
      'bar_parameters',
      'basic_types',
      'file_upload'
    ]
  }
};

export const SCENARIO_PARAMETERS_CONFIG = {
  parameters: PARAMETERS,
  parametersGroups: PARAMETERS_GROUPS,
  runTemplates: RUN_TEMPLATES
};

// Dataset part (file) tab parameter
export const INITIAL_STOCK_PARAM = {
  id: 'initial_stock_dataset',
  description: 'Initial stock dataset part',
  varType: '%DATASETID%',
  connectorId: 'C-XPv4LBVGAL',
  defaultFileTypeFilter: '.zip,.csv,.json,.xls,.xlsx'
};
