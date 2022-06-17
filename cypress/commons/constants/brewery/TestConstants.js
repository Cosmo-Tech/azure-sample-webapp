// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const TEST_CYPRESS = 'Test Cypress';

export const SCENARIO_NAME = {
  SCENARIO_MASTER: TEST_CYPRESS + ' Master - ',
  SCENARIO_CHILD: TEST_CYPRESS + ' Child - ',
  SCENARIO_WITH_BASIC_TYPES: TEST_CYPRESS + ' with basic types - ',
  SCENARIO_WITH_FILES: TEST_CYPRESS + ' with files - ',
  OTHER_SCENARIO: TEST_CYPRESS + ' another scenario - ',
};

export const BAR_PARAMETERS_RANGE = {
  STOCK: {
    MIN: 0,
    MAX: 9999,
  },
  RESTOCK: {
    MIN: -1,
    MAX: 9999,
  },
  WAITERS: {
    MIN: 0,
    MAX: 20,
  },
};

export const BASIC_PARAMETERS_CONST = {
  NUMBER: {
    MIN: -999,
    MAX: 9999,
  },
  ENUM: {
    USD: '$',
    EUR: '€',
    BTC: '฿',
    JPY: '¥',
  },
  DATE: {
    MIN: new Date('01/01/1900'),
    MAX: new Date('12/31/2099'),
  },
};

export const DATASET = {
  BREWERY_ADT: 'Brewery ADT reference',
};

export const RUN_TEMPLATE = {
  BREWERY_PARAMETERS: 'Run template with Brewery parameters',
  BASIC_TYPES: 'Run template with mock basic types parameters',
  WITHOUT_PARAMETERS: 'Run template without parameters',
  HIDDEN: 'Hidden test run template without parameters',
};
