// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_SOLUTION } from '../default';

const SOLUTION_WITH_ADD_ROW_FEATURE = {
  ...DEFAULT_SOLUTION,
  parameters: [
    {
      id: 'customers',
      labels: {
        fr: 'Clients',
        en: 'Customers',
      },
      varType: '%DATASETID%',
      options: {
        canChangeRowsNumber: true,
        connectorId: 'c-d7e5p9o0kjn9',
        description: 'customers data',
        subType: 'TABLE',
        columns: [
          {
            field: 'name',
            type: ['nonResizable', 'nonSortable'],
            defaultValue: 'defaultName',
          },
          {
            field: 'age',
            type: ['int'],
            minValue: 0,
            maxValue: 120,
            acceptsEmptyFields: true,
          },
          {
            field: 'canDrinkAlcohol',
            type: ['bool'],
          },
          {
            field: 'favoriteDrink',
            type: ['enum'],
            enumValues: ['AppleJuice', 'Beer', 'OrangeJuice', 'Wine'],
          },
          {
            field: 'birthday',
            type: ['date'],
            minValue: '1900-01-01',
            maxValue: '2022-12-19T13:46:15.223Z',
            acceptsEmptyFields: true,
          },
          {
            field: 'height',
            type: ['number'],
            minValue: 0,
            maxValue: 2.5,
            acceptsEmptyFields: true,
          },
        ],
        dateFormat: 'dd/MM/yyyy',
        tooltipText: {
          fr: 'Importez ou exportez un fichier clients',
          en: 'Import or export a customers file',
        },
      },
    },
    {
      id: 'customers-stub',
      labels: {
        fr: 'Nouveau clients',
        en: 'New clients',
      },
      varType: '%DATASETID%',
      options: {
        canChangeRowsNumber: true,
        connectorId: 'c-d7e5p9o0kjn9',
        description: 'customers data',
        subType: 'TABLE',
        columns: [
          {
            field: 'name',
            type: ['nonResizable', 'nonSortable'],
            defaultValue: 'defaultName',
          },
          {
            field: 'age',
            type: ['int'],
            minValue: 0,
            maxValue: 120,
            acceptsEmptyFields: true,
          },
          {
            field: 'canDrinkAlcohol',
            type: ['bool'],
          },
          {
            field: 'favoriteDrink',
            type: ['enum'],
            enumValues: ['AppleJuice', 'Beer', 'OrangeJuice', 'Wine'],
          },
          {
            field: 'birthday',
            type: ['date'],
            minValue: '1900-01-01',
            maxValue: '2022-12-19T13:46:15.223Z',
            acceptsEmptyFields: true,
          },
          {
            field: 'height',
            type: ['number'],
            minValue: 0,
            maxValue: 2.5,
            acceptsEmptyFields: true,
          },
        ],
        dateFormat: 'dd/MM/yyyy',
        tooltipText: {
          fr: 'Importez ou exportez un fichier clients',
          en: 'Import or export a customers file',
        },
      },
    },
  ],
  parameterGroups: [
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
        fr: 'Events',
      },
      parameters: ['customers-stub'],
    },
  ],
};

export const SOLUTIONS = [SOLUTION_WITH_ADD_ROW_FEATURE];
