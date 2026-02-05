// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { PARAMETERS } from './runTemplateParameters';

const ENUM = { id: 'enumGroup', parameters: [PARAMETERS.ETL_ENUM.id] };
const LIST = { id: 'listGroup', parameters: [PARAMETERS.ETL_LIST.id] };
const STRING = { id: 'stringGroup', parameters: [PARAMETERS.ETL_STRING.id] };
const DATE = { id: 'dateGroup', parameters: [PARAMETERS.ETL_DATE.id] };

const PARTIALLY_PREFILLED = {
  id: 'partiallyPrefilledGroup',
  parameters: [PARAMETERS.ETL_STRING.id, PARAMETERS.ETL_STRING_WITH_DEFAULT.id],
};

const DYNAMIC_VALUES_CUSTOMERS = {
  id: 'dynamic_values_customers_group',
  parameters: [PARAMETERS.DYNAMIC_VALUES_CUSTOMERS_ENUM.id],
};

const BAR_PARAMETERS = {
  id: 'bar_parameters',
  labels: { fr: 'Bar', en: 'Pub' },
  isTable: null,
  additionalData: null,
  parentId: null,
  parameters: [PARAMETERS.STOCK.id, PARAMETERS.RESTOCK_QTY.id, PARAMETERS.NB_WAITERS.id],
};

const FILE_UPLOAD = {
  id: 'file_upload',
  labels: { fr: 'Valeurs initiales', en: 'Initial values' },
  isTable: null,
  additionalData: null,
  parameters: [PARAMETERS.INITIAL_STOCK_DATASET.id],
  parentId: null,
};

const BASIC_TYPES = {
  id: 'basic_types',
  labels: { fr: 'Exemples de types standards', en: 'Basic types examples' },
  isTable: null,
  additionalData: null,
  parentId: null,
  parameters: [
    PARAMETERS.CURRENCY.id,
    PARAMETERS.CURRENCY_NAME.id,
    PARAMETERS.CURRENCY_VALUE.id,
    PARAMETERS.CURRENCY_USED.id,
    PARAMETERS.START_DATE.id,
    PARAMETERS.AVERAGE_CONSUMPTION.id,
  ],
};

const TRAINING_DATES = {
  id: 'training_dates',
  labels: { fr: 'Dates de simulation', en: 'Simulation dates' },
  isTable: null,
  additionalData: null,
  parentId: null,
  parameters: [PARAMETERS.TRAINING_START_DATE.id, PARAMETERS.TRAINING_END_DATE.id],
};

const DATASET_PARTS = {
  id: 'dataset_parts',
  labels: {
    en: 'Dataset parts',
    fr: 'Fragments de dataset',
  },
  isTable: null,
  additionalData: null,
  parentId: null,
  parameters: [PARAMETERS.EXAMPLE_DATASET_PART_1.id, PARAMETERS.EXAMPLE_DATASET_PART_2.id],
};

const EXTRA_DATASET_PART = {
  id: 'extra_dataset_part',
  labels: {
    en: 'Additional dataset part',
    fr: 'Fragment additionel',
  },
  isTable: null,
  additionalData: null,
  parentId: null,
  parameters: [PARAMETERS.EXAMPLE_DATASET_PART_3.id],
};

const CUSTOMERS = {
  id: 'customers',
  labels: {
    en: 'Customers',
    fr: 'Clients',
  },
  isTable: null,
  additionalData: null,
  parentId: null,
  parameters: [PARAMETERS.CUSTOMERS.id],
};

const EVENTS = {
  id: 'events',
  labels: {
    en: 'Events',
    fr: 'Évènements',
  },
  isTable: null,
  additionalData: null,
  parentId: null,
  parameters: [PARAMETERS.EVENTS.id, PARAMETERS.ADDITIONAL_SEATS.id, PARAMETERS.ACTIVATED.id, PARAMETERS.EVALUATION.id],
};

const ADDITIONAL_PARAMETERS = {
  id: 'additional_parameters',
  labels: {
    en: 'Additional parameters',
    fr: 'Paramètres additionnels',
  },
  isTable: null,
  additionalData: null,
  parentId: null,
  parameters: [
    PARAMETERS.VOLUME_UNIT.id,
    PARAMETERS.ADDITIONAL_TABLES.id,
    PARAMETERS.COMMENT.id,
    PARAMETERS.ADDITIONAL_DATE.id,
  ],
};

export const PARAMETER_GROUPS = {
  ENUM,
  LIST,
  STRING,
  DATE,
  PARTIALLY_PREFILLED,
  DYNAMIC_VALUES_CUSTOMERS,
  BAR_PARAMETERS,
  FILE_UPLOAD,
  BASIC_TYPES,
  TRAINING_DATES,
  DATASET_PARTS,
  EXTRA_DATASET_PART,
  CUSTOMERS,
  EVENTS,
  ADDITIONAL_PARAMETERS,
};
