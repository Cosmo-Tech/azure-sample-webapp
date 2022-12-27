// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { APP_ROLES } from '../../services/config/accessControl';

// Use the SOLUTIONS array below to override or add information to your solutions. This can be useful for development
// purposes, but it is recommended to leave this array empty and use the API to update your Solution instead for
// production environments.
export const SOLUTIONS = [
  {
    id: 'SOL-VkqXyNONQyB',
    parameters: [
      {
        id: 'nb_waiters',
        dataCy: 'waiters-input',
        subType: 'SLIDER',
        minValue: 0,
        maxValue: 35,
        defaultValue: 5,
      },
      {
        id: 'restock_qty',
        dataCy: 'restock-input',
        defaultValue: 25,
      },
      {
        id: 'stock',
        dataCy: 'stock-input',
        defaultValue: 100,
      },
      {
        id: 'currency',
        dataCy: 'currency',
        defaultValue: 'USD',
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
      {
        id: 'currency_name',
        dataCy: 'currency_name',
        defaultValue: 'EUR',
      },
      {
        id: 'currency_value',
        dataCy: 'currency_value',
        defaultValue: 1000,
      },
      {
        id: 'currency_used',
        dataCy: 'currency_used',
        labels: {
          en: 'Use currency',
          fr: 'Activer la monnaie',
        },
        defaultValue: false,
      },
      {
        id: 'start_date',
        dataCy: 'start_date',
        defaultValue: new Date('2014-08-18T21:11:54'),
      },
      {
        id: 'additional_seats',
        dataCy: 'additional_seats',
        defaultValue: -4,
        minValue: -600,
        maxValue: 2500,
        labels: {
          en: 'Additional seats (min -600, max 2500)',
          fr: 'Sièges additionnels (min -600, max 2500)',
        },
      },
      {
        id: 'activated',
        dataCy: 'activated',
        defaultValue: false,
      },
      {
        id: 'additional_tables',
        dataCy: 'additional_tables',
        defaultValue: 3,
        minValue: -150,
        maxValue: 12000,
        labels: {
          en: 'Additional tables (min -150, max 12000)',
          fr: 'Tables additionnelles (min -150, max 12000)',
        },
      },
      {
        id: 'volume_unit',
        dataCy: 'volume_unit',
        defaultValue: 'LITRE',
        labels: {
          en: 'Volume unit',
          fr: 'Unité de volume',
        },
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
      {
        id: 'evaluation',
        dataCy: 'evaluation',
        defaultValue: 'Good',
      },
      {
        id: 'comment',
        dataCy: 'comment',
        defaultValue: 'None',
      },
      {
        id: 'additional_date',
        dataCy: 'additional_date',
        defaultValue: new Date('2022/06/22'),
        minValue: new Date('2022/01/01'),
        maxValue: new Date('2022/12/31'),
      },
      {
        id: 'initial_stock_dataset',
        dataCy: 'initial_stock_dataset',
        connectorId: 'c-d7e5p9o0kjn9',
        defaultFileTypeFilter: '.zip,.csv,.json,.xls,.xlsx',
        description: 'Initial stock dataset part',
      },
      {
        id: 'example_dataset_part_1',
        dataCy: 'example_dataset_part_1',
        connectorId: 'c-d7e5p9o0kjn9',
        defaultFileTypeFilter: '.zip,.csv,.json,.xls,.xlsx',
        description: '1st example of dataset part',
      },
      {
        id: 'example_dataset_part_2',
        dataCy: 'example_dataset_part_2',
        connectorId: 'c-d7e5p9o0kjn9',
        defaultFileTypeFilter: '.zip,.csv,.json,.xls,.xlsx',
        description: '2nd example of dataset part',
      },
      {
        id: 'example_dataset_part_3',
        dataCy: 'example_dataset_part_3',
        connectorId: 'c-d7e5p9o0kjn9',
        defaultFileTypeFilter: '.zip,.csv,.json,.xls,.xlsx',
        description: '3rd example of dataset part',
      },
      {
        id: 'customers',
        dataCy: 'customers_table',
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
      {
        id: 'events',
        dataCy: 'events_table',
        connectorId: 'c-d7e5p9o0kjn9',
        description: 'events data',
        subType: 'TABLE',
        dateFormat: 'dd/MM/yyyy',
        defaultValue: 'd-xolyln1kq85d',
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
    ],
    parameterGroups: [
      {
        id: 'bar_parameters',
        labels: {
          en: 'Pub parameters',
          fr: 'Paramètres du bar',
        },
        parameters: ['stock', 'restock_qty', 'nb_waiters'],
      },
      {
        id: 'basic_types',
        parameters: ['currency', 'currency_name', 'currency_value', 'currency_used', 'start_date'],
        authorizedRoles: [APP_ROLES.PlatformAdmin, APP_ROLES.OrganizationUser],
        hideParameterGroupIfNoPermission: false,
      },
      {
        id: 'file_upload',
        labels: {
          en: 'Initial values',
          fr: 'Valeurs initiales',
        },
        parameters: ['initial_stock_dataset'],
      },
      {
        id: 'dataset_parts',
        labels: {
          en: 'Dataset parts',
          fr: 'Fragments de dataset',
        },
        parameters: ['example_dataset_part_1', 'example_dataset_part_2'],
      },
      {
        id: 'extra_dataset_part',
        labels: {
          en: 'Additional dataset part',
          fr: 'Fragment additionel',
        },
        parameters: ['example_dataset_part_3'],
      },
      {
        id: 'customers',
        labels: {
          en: 'Customers',
          fr: 'Clients',
        },
        parameters: ['customers'],
      },
      {
        id: 'events',
        labels: {
          en: 'Events',
          fr: 'Évènements',
        },
        parameters: ['events', 'additional_seats', 'activated', 'evaluation'],
      },
      {
        id: 'additional_parameters',
        labels: {
          en: 'Additional parameters',
          fr: 'Paramètres additionnels',
        },
        parameters: ['volume_unit', 'additional_tables', 'comment', 'additional_date'],
      },
    ],
    runTemplates: [
      {
        id: '1',
        parameterGroups: ['bar_parameters', 'file_upload'],
      },
      {
        id: '3',
        parameterGroups: [
          'basic_types',
          'dataset_parts',
          'extra_dataset_part',
          'customers',
          'events',
          'additional_parameters',
        ],
      },
    ],
  },
];
