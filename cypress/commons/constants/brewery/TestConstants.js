// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const SCENARIO_STATUS = {
  CREATED: 'created',
  RUNNING: 'running',
  SUCCESSFUL: 'successful',
  FAILED: 'failed',
  UNKNOWN: 'unknown',
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
  ENUM_KEYS: {
    USD: 'USD',
    EUR: 'EUR',
    BTC: 'BTC',
    JPY: 'JPY',
  },
  DATE: {
    MIN: new Date('01/01/1900'),
    MAX: new Date('12/31/2099'),
  },
  SLIDER: {
    MIN: 0,
    MAX: 10,
  },
};

export const DATASET = {
  BREWERY_ADT: 'Demo Brewery ADT reference',
  BREWERY_STORAGE: 'Demo Brewery Storage reference',
};

export const RUN_TEMPLATE = {
  BREWERY_PARAMETERS: 'Run template with Brewery parameters',
  BASIC_TYPES: 'Run template with mock basic types parameters',
  WITHOUT_PARAMETERS: 'Run template without parameters',
  HIDDEN: 'Hidden test run template without parameters',
};
