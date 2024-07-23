// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_SOLUTION } from '../default';

export const SOLUTION_WITH_DYNAMIC_TABLE = {
  ...DEFAULT_SOLUTION,
  runTemplates: [
    {
      id: '3',
      name: 'Run template with mock basic types parameters',
      description: 'Run template with mock basic types parameters',
      csmSimulation: 'BreweryDemoSimulationWithConnector',
      tags: ['3', 'Example'],
      parameterGroups: ['basic_types', 'events', 'customers'],
    },
  ],
  parameterGroups: [
    {
      id: 'basic_types',
      labels: {
        en: 'Basic types',
        fr: 'Exemples de types standards',
      },
      parameters: ['additional_seats'],
    },
    {
      id: 'events',
      labels: {
        en: 'Events',
        fr: 'Événements',
      },
      parameters: ['events'],
    },
    {
      id: 'customers',
      labels: {
        en: 'Customers',
        fr: 'Clients',
      },
      parameters: ['customers'],
    },
  ],
  parameters: [
    {
      id: 'customers',
      labels: {
        fr: 'Clients',
        en: 'Customers',
      },
      varType: '%DATASETID%',
      defaultValue: null,
      minValue: null,
      maxValue: null,
      regexValidation: null,
      options: {
        canChangeRowsNumber: true,
        connectorId: 'c-d7e5p9o0kjn9',
        subType: 'TABLE',
        dynamicValues: {
          query:
            'MATCH(customer: Customer) WITH {name: customer.id, satisfaction: customer.Satisfaction, ' +
            'surroundingSatisfaction: customer.SurroundingSatisfaction, thirsty: customer.Thirsty} ' +
            'as fields RETURN fields',
          resultKey: 'fields',
        },
        columns: [
          {
            field: 'name',
            headerName: 'Name',
            type: ['string'],
          },
          {
            field: 'satisfaction',
            headerName: 'Satisfaction',
            type: ['int'],
            minValue: 0,
            maxValue: 10,
            acceptsEmptyFields: true,
          },
          {
            field: 'surroundingSatisfaction',
            headerName: 'SurroundingSatisfaction',
            type: ['int'],
            minValue: 0,
            maxValue: 10,
            acceptsEmptyFields: true,
          },
          {
            field: 'thirsty',
            headerName: 'Thirsty',
            type: ['bool'],
            acceptsEmptyFields: true,
          },
        ],
      },
    },
    {
      id: 'events',
      labels: {
        fr: 'Événements',
        en: 'Events',
      },
      varType: '%DATASETID%',
      options: {
        subType: 'TABLE',
        columns: [
          {
            field: 'theme',
            type: ['string'],
          },
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
          {
            field: 'online',
            type: ['bool', 'nonSortable'],
          },
        ],
        dateFormat: 'dd/MM/yyyy',
      },
    },
    {
      id: 'additional_seats',
      labels: {
        fr: 'Sièges additionnels',
        en: 'Additional seats',
      },
      varType: 'number',
      defaultValue: '-4',
      minValue: '-600',
      maxValue: '2500',
    },
  ],
};
