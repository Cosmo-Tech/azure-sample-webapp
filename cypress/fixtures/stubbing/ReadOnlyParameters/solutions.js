// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_SOLUTION, RUN_TEMPLATE_EXAMPLE } from '../default';

const READ_ONLY_PARAMETERS = [
  {
    id: 'readonly_bool',
    labels: { fr: 'Booléen en lecture seule', en: 'Read-only boolean' },
    varType: 'bool',
    defaultValue: 'true',
    additionalData: { readOnly: true },
  },
  {
    id: 'readonly_date',
    labels: { fr: 'Date en lecture seule', en: 'Read-only date' },
    varType: 'date',
    defaultValue: '2025-01-01T00:00:00.000Z',
    additionalData: { readOnly: true },
  },
  {
    id: 'readonly_enum',
    labels: { fr: 'Liste déroulante en lecture seule', en: 'Read-only dropdown' },
    varType: 'enum',
    defaultValue: 'OPTION_A',
    additionalData: {
      readOnly: true,
      enumValues: [
        { key: 'OPTION_A', value: { fr: 'Option A', en: 'Option A' } },
        { key: 'OPTION_B', value: { fr: 'Option B', en: 'Option B' } },
      ],
    },
  },
  {
    id: 'readonly_dynamic_enum',
    labels: { fr: 'Liste déroulante dynamique en lecture seule', en: 'Read-only dynamic dropdown' },
    varType: 'enum',
    additionalData: {
      readOnly: true,
      dynamicEnumValues: {
        type: 'dbDatasetPart',
        datasetPartName: 'Customer',
        resultKey: 'id',
        options: { selects: 'id' },
      },
    },
  },
  {
    id: 'readonly_enum_radio',
    labels: { fr: 'Boutons radio en lecture seule', en: 'Read-only radio buttons' },
    varType: 'enum',
    defaultValue: 'OPTION_B',
    additionalData: {
      readOnly: true,
      subType: 'RADIO',
      enumValues: [
        { key: 'OPTION_A', value: { fr: 'Option A', en: 'Option A' } },
        { key: 'OPTION_B', value: { fr: 'Option B', en: 'Option B' } },
      ],
    },
  },
  {
    id: 'readonly_enum_scenarios',
    labels: { fr: 'Sélecteur de scénario en lecture seule', en: 'Read-only scenario selector' },
    varType: 'enum',
    additionalData: {
      readOnly: true,
      subType: 'SCENARIOS',
      runTemplateFilter: ['readonly_parameters'],
    },
  },
  {
    id: 'readonly_list',
    labels: { fr: 'Sélection multiple en lecture seule', en: 'Read-only multiple selection' },
    varType: 'list',
    defaultValue: '["FRANCE","INDIA"]',
    additionalData: {
      readOnly: true,
      enumValues: [
        { key: 'FRANCE', value: { fr: 'France', en: 'France' } },
        { key: 'INDIA', value: { fr: 'Inde', en: 'India' } },
      ],
    },
  },
  {
    id: 'readonly_dynamic_list',
    labels: { fr: 'Sélection multiple dynamique en lecture seule', en: 'Read-only dynamic multiple selection' },
    varType: 'list',
    additionalData: {
      readOnly: true,
      dynamicEnumValues: {
        type: 'dbDatasetPart',
        datasetPartName: 'Customer',
        resultKey: 'id',
        options: { selects: 'id' },
      },
    },
  },
  {
    id: 'readonly_number',
    labels: { fr: 'Nombre en lecture seule', en: 'Read-only number' },
    varType: 'number',
    defaultValue: '42',
    additionalData: { readOnly: true },
  },
  {
    id: 'readonly_dynamic_number',
    labels: { fr: 'Nombre dynamique en lecture seule', en: 'Read-only dynamic number' },
    varType: 'number',
    additionalData: {
      readOnly: true,
      dynamicValues: {
        type: 'dbDatasetPart',
        datasetPartName: 'Customer',
        resultKey: 'count_id',
        options: { counts: 'id' },
      },
    },
  },
  {
    id: 'readonly_number_slider',
    labels: { fr: 'Curseur en lecture seule', en: 'Read-only slider' },
    varType: 'number',
    defaultValue: '50',
    minValue: '0',
    maxValue: '100',
    additionalData: { readOnly: true, subType: 'SLIDER' },
  },
  {
    id: 'readonly_int',
    labels: { fr: 'Entier en lecture seule', en: 'Read-only integer' },
    varType: 'int',
    defaultValue: '7',
    additionalData: { readOnly: true },
  },
  {
    id: 'readonly_dynamic_int',
    labels: { fr: 'Entier dynamique en lecture seule', en: 'Read-only dynamic integer' },
    varType: 'int',
    additionalData: {
      readOnly: true,
      dynamicValues: {
        type: 'dbDatasetPart',
        datasetPartName: 'Customer',
        resultKey: 'count_id',
        options: { counts: 'id' },
      },
    },
  },
  {
    id: 'readonly_string',
    labels: { fr: 'Texte en lecture seule', en: 'Read-only text' },
    varType: 'string',
    defaultValue: 'Read-only example',
    additionalData: { readOnly: true },
  },
  {
    id: 'readonly_file',
    labels: { fr: 'Fichier en lecture seule', en: 'Read-only file' },
    varType: '%DATASET_PART_ID_FILE%',
    additionalData: {
      readOnly: true,
      description: 'Read-only file example',
      defaultFileTypeFilter: '.zip,.csv,.json,.xls,.xlsx',
    },
  },
  {
    id: 'readonly_table_events',
    labels: { fr: 'Tableau des événements (lecture seule)', en: 'Read-only table for events' },
    varType: '%DATASET_PART_ID_FILE%',
    additionalData: {
      readOnly: true,
      subType: 'TABLE',
      columns: [
        { field: 'theme', type: ['string'] },
        { field: 'date', type: ['date'] },
        {
          field: 'timeOfDay',
          type: ['enum'],
          enumValues: ['morning', 'midday', 'afternoon', 'evening'],
        },
        { field: 'eventType', type: ['string', 'nonEditable'] },
        { field: 'reservationsNumber', type: ['int'] },
        { field: 'online', type: ['bool'] },
      ],
      dateFormat: 'dd/MM/yyyy',
    },
  },
  {
    id: 'readonly_dynamic_table_customers',
    labels: {
      fr: 'Tableau dynamique des clients en lecture seule',
      en: 'Read-only dynamic customers table',
    },
    varType: '%DATASET_PART_ID_FILE%',
    additionalData: {
      readOnly: true,
      subType: 'TABLE',
      dynamicValues: {
        datasetPartName: 'Customer',
        options: { selects: 'id,Satisfaction,SurroundingSatisfaction,Thirsty' },
      },
      columns: [
        { field: 'id', headerName: 'Name', type: ['string'] },
        { field: 'Satisfaction', headerName: 'Satisfaction', type: ['int'], minValue: '0', maxValue: '10' },
        {
          field: 'SurroundingSatisfaction',
          headerName: 'Surrounding satisfaction',
          type: ['int'],
          minValue: '0',
          maxValue: '10',
        },
        { field: 'Thirsty', headerName: 'Thirsty', type: ['bool'] },
      ],
    },
  },
];

const PARAMETER_GROUPS = [
  {
    id: 'readonly_basic_types',
    labels: { en: 'Basic types', fr: 'Types de base' },
    parameters: ['readonly_bool', 'readonly_date', 'readonly_enum', 'readonly_enum_radio', 'readonly_enum_scenarios'],
  },
  {
    id: 'readonly_additional_basic_types',
    labels: { en: 'More basic types', fr: 'Autres types de base' },
    parameters: ['readonly_list', 'readonly_number', 'readonly_number_slider', 'readonly_int', 'readonly_string'],
  },
  {
    id: 'readonly_dynamic_values',
    labels: { en: 'Dynamic values', fr: 'Valeurs dynamiques' },
    parameters: ['readonly_dynamic_enum', 'readonly_dynamic_list', 'readonly_dynamic_number', 'readonly_dynamic_int'],
  },
  {
    id: 'readonly_files',
    labels: { en: 'Files', fr: 'Fichiers' },
    parameters: ['readonly_file'],
  },
  {
    id: 'readonly_tables',
    labels: { en: 'Tables', fr: 'Tableaux' },
    parameters: ['readonly_table_events', 'readonly_dynamic_table_customers'],
  },
];

export const READ_ONLY_RUN_TEMPLATE = {
  ...RUN_TEMPLATE_EXAMPLE,
  id: 'readonly_parameters',
  name: 'Run Template with read-only parameters',
  description: 'Run Template with read-only parameters',
  tags: ['readonly_parameters'],
  parameterGroups: PARAMETER_GROUPS.map((group) => group.id),
};

export const READ_ONLY_SUBDATASOURCE_RUN_TEMPLATE = {
  ...READ_ONLY_RUN_TEMPLATE,
  id: 'readonly_parameters_subdatasource',
  tags: ['subdatasource'],
};

export const SOLUTION = {
  ...DEFAULT_SOLUTION,
  parameters: READ_ONLY_PARAMETERS,
  parameterGroups: PARAMETER_GROUPS,
  runTemplates: [READ_ONLY_RUN_TEMPLATE, READ_ONLY_SUBDATASOURCE_RUN_TEMPLATE],
};
