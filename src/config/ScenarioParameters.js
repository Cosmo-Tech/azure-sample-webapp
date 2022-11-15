// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// Use the PARAMETERS dict below to override or add information to the scenario parameters defined in your solution
// description, such as:
//  - a default value for each scenario parameter on scenario creation
//  - lists of possible values for "enum" parameters
//  - translation labels

import { APP_ROLES } from '../services/config/accessControl';

const PARAMETERS = {
  nb_waiters: {
    defaultValue: 5,
  },
  restock_qty: {
    defaultValue: 25,
  },
  stock: {
    defaultValue: 100,
  },
  currency: {
    defaultValue: 'USD',
    options: {
      enumValues: [
        {
          key: 'USD',
          value: '$',
        },
        {
          key: 'EUR',
          value: '€',
        },
        {
          key: 'BTC',
          value: '฿',
        },
        {
          key: 'JPY',
          value: '¥',
        },
      ],
    },
  },
  currency_name: {
    defaultValue: 'EUR',
  },
  currency_value: {
    defaultValue: 1000,
  },
  currency_used: {
    labels: {
      en: 'Use currency',
      fr: 'Activer la monnaie',
    },
    defaultValue: false,
  },
  start_date: {
    defaultValue: new Date('2014-08-18T21:11:54'),
  },
  additional_seats: {
    defaultValue: -4,
    minValue: -600,
    maxValue: 2500,
    labels: {
      en: 'Additional seats (min -600, max 2500)',
      fr: 'Sièges additionnels (min -600, max 2500)',
    },
  },
  activated: {
    defaultValue: false,
  },
  additional_tables: {
    defaultValue: 3,
    minValue: -150,
    maxValue: 12000,
    labels: {
      en: 'Additional tables (min -150, max 12000)',
      fr: 'Tables additonnelles (min -150, max 12000)',
    },
  },
  volume_unit: {
    defaultValue: 'LITRE',
    labels: {
      en: 'Volume unit',
      fr: 'Unité de volume',
    },
    options: {
      enumValues: [
        {
          key: 'LITRE',
          value: 'L',
        },
        {
          key: 'BARREL',
          value: 'bl',
        },
        {
          key: 'CUBIC_METRE',
          value: 'm³',
        },
      ],
    },
  },
  evaluation: {
    defaultValue: 'Good',
  },
  comment: {
    defaultValue: 'None',
  },
  additional_date: {
    defaultValue: new Date('2022/06/22'),
    minValue: new Date('2022/01/01'),
    maxValue: new Date('2022/12/31'),
  },
  initial_stock_dataset: {
    options: {
      connectorId: 'c-d7e5p9o0kjn9',
      defaultFileTypeFilter: '.zip,.csv,.json,.xls,.xlsx',
      description: 'Initial stock dataset part',
    },
  },
  example_dataset_part_1: {
    options: {
      connectorId: 'c-d7e5p9o0kjn9',
      defaultFileTypeFilter: '.zip,.csv,.json,.xls,.xlsx',
      description: '1st example of dataset part',
    },
  },
  example_dataset_part_2: {
    options: {
      connectorId: 'c-d7e5p9o0kjn9',
      defaultFileTypeFilter: '.zip,.csv,.json,.xls,.xlsx',
      description: '2nd example of dataset part',
    },
  },
  example_dataset_part_3: {
    options: {
      connectorId: 'c-d7e5p9o0kjn9',
      defaultFileTypeFilter: '.zip,.csv,.json,.xls,.xlsx',
      description: '3rd example of dataset part',
    },
  },
  customers: {
    options: {
      connectorId: 'c-d7e5p9o0kjn9',
      description: 'customers data',
      subType: 'TABLE',
      dateFormat: 'dd/MM/yyyy',
      columns: [
        { field: 'name', type: ['nonResizable', 'nonEditable', 'nonSortable'] },
        { field: 'age', type: ['int'], minValue: 0, maxValue: 120, acceptsEmptyFields: true },
        { field: 'canDrinkAlcohol', type: ['bool'] },
        {
          field: 'favoriteDrink',
          type: ['enum'],
          enumValues: ['AppleJuice', 'Beer', 'OrangeJuice', 'Wine'],
        },
        {
          field: 'birthday',
          type: ['date'],
          minValue: '1900-01-01',
          maxValue: new Date().toISOString(),
          acceptsEmptyFields: true,
        },
        { field: 'height', type: ['number'], minValue: 0, maxValue: 2.5, acceptsEmptyFields: true },
      ],
    },
  },
  events: {
    options: {
      connectorId: 'c-d7e5p9o0kjn9',
      description: 'events data',
      subType: 'TABLE',
      dateFormat: 'dd/MM/yyyy',
      columns: [
        { field: 'theme', type: ['string'] },
        {
          field: 'date',
          type: ['date'],
          minValue: '1900-01-01',
          maxValue: '2999-12-31',
        },
        {
          field: 'timeOfDay',
          type: ['enum'],
          enumValues: ['morning', 'midday', 'afternoon', 'evening'],
        },
        {
          field: 'eventType',
          type: ['string', 'nonResizable', 'nonEditable'],
        },
        {
          field: 'reservationsNumber',
          type: ['int'],
          minValue: 0,
          maxValue: 300,
          acceptsEmptyFields: true,
        },
        { field: 'online', type: ['bool', 'nonSortable'] },
      ],
    },
    defaultValue: 'd-xolyln1kq85d',
  },
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
      en: 'Pub parameters',
      fr: 'Paramètres du bar',
    },
    parameters: ['stock', 'restock_qty', 'nb_waiters'],
  },
  basic_types: {
    parameters: ['currency', 'currency_name', 'currency_value', 'currency_used', 'start_date'],
    options: {
      authorizedRoles: [APP_ROLES.PlatformAdmin, APP_ROLES.OrganizationUser],
      hideParameterGroupIfNoPermission: false,
    },
  },
  file_upload: {
    labels: {
      en: 'Initial values',
      fr: 'Valeurs initiales',
    },
    parameters: ['initial_stock_dataset'],
  },
  dataset_parts: {
    labels: {
      en: 'Dataset parts',
      fr: 'Fragments de dataset',
    },
    parameters: ['example_dataset_part_1', 'example_dataset_part_2'],
  },
  extra_dataset_part: {
    labels: {
      en: 'Additional dataset part',
      fr: 'Fragment additionel',
    },
    parameters: ['example_dataset_part_3'],
  },
  customers: {
    labels: {
      en: 'Customers',
      fr: 'Clients',
    },
    parameters: ['customers'],
  },
  events: {
    labels: {
      en: 'Events',
      fr: 'Évènements',
    },
    parameters: ['events', 'additional_seats', 'activated', 'evaluation'],
  },
  additional_parameters: {
    labels: {
      en: 'Additional parameters',
      fr: 'Paramètres additionnels',
    },
    parameters: ['volume_unit', 'additional_tables', 'comment', 'additional_date'],
  },
};

// Use RUN_TEMPLATES dict below to override information of the run templates defined in your solution description, such
// as:
//  - list and order of the parameters group to display for this run template
const RUN_TEMPLATES = {
  1: {
    // Use 'parameterGroups' instead of 'parametersGroups' in the run templates description to be consistent
    // with back-end format
    parameterGroups: ['bar_parameters', 'file_upload'],
  },
  3: {
    parameterGroups: [
      'basic_types',
      'dataset_parts',
      'extra_dataset_part',
      'customers',
      'events',
      'additional_parameters',
    ],
  },
};

// Additional parameters to put in scenario parameters
export const ADD_SCENARIO_NAME_PARAMETER = false;
export const ADD_SCENARIO_ID_PARAMETER = false;
export const ADD_SCENARIO_LAST_RUN_ID_PARAMETER = false;
export const ADD_SCENARIO_PARENT_ID_PARAMETER = false;
export const ADD_SCENARIO_PARENT_LAST_RUN_ID_PARAMETER = false;
export const ADD_SCENARIO_MASTER_ID_PARAMETER = false;
export const ADD_SCENARIO_MASTER_LAST_RUN_ID_PARAMETER = false;
export const ADD_SCENARIO_RUN_TEMPLATE_NAME_PARAMETER = false;

export const SCENARIO_PARAMETERS_CONFIG = {
  parameters: PARAMETERS,
  parametersGroups: PARAMETERS_GROUPS,
  runTemplates: RUN_TEMPLATES,
};
