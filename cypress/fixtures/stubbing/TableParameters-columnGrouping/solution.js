// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_SOLUTION } from '../default';

const SOLUTION_WITH_COLUMN_GROUP = {
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
            headerName: 'GroupToSearch',
            children: [
              {
                field: 'name',
                type: ['nonResizable', 'nonSortable'],
                columnGroupShow: 'closed',
              },
              {
                field: 'age',
                type: ['int'],
                minValue: 0,
                maxValue: 120,
                acceptsEmptyFields: true,
                columnGroupShow: 'open',
              },
              {
                field: 'canDrinkAlcohol',
                type: ['bool'],
              },
            ],
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
  ],
};

export const SOLUTIONS = [SOLUTION_WITH_COLUMN_GROUP];
