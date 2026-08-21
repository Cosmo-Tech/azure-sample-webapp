// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// requiredEnabledWithInconsistentConfig test case
const ENUM_REQUIRED_TRUE_NO_ENUM_VALUES = {
  id: 'enumRequiredTrue_noEnumValues',
  varType: 'enum',
  additionalData: { required: true },
};
const LIST_REQUIRED_TRUE_NO_ENUM_VALUES = {
  id: 'listRequiredTrue_noEnumValues',
  varType: 'list',
  additionalData: { required: true },
};

export const REQUIRED_ENABLED_WITH_INCONSISTENT_CONFIG_PARAMETERS = [
  ENUM_REQUIRED_TRUE_NO_ENUM_VALUES,
  LIST_REQUIRED_TRUE_NO_ENUM_VALUES,
];

// notImpactedByRequired test case
const BOOL_REQUIRED_TRUE = { id: 'boolRequiredTrue', varType: 'bool', additionalData: { required: true } };
const BOOL_REQUIRED_FALSE = { id: 'boolRequiredFalse', varType: 'bool', additionalData: { required: false } };
const BOOL_REQUIRED_UNDEFINED = { id: 'boolRequiredUndefined', varType: 'bool' };
const SLIDER_REQUIRED_TRUE = {
  id: 'sliderRequiredTrue',
  varType: 'number',
  additionalData: { subType: 'SLIDER', required: true },
};
const SLIDER_REQUIRED_FALSE = {
  id: 'sliderRequiredFalse',
  varType: 'number',
  additionalData: { subType: 'SLIDER', required: false },
};
const SLIDER_REQUIRED_UNDEFINED = {
  id: 'sliderRequiredUndefined',
  varType: 'number',
  additionalData: { subType: 'SLIDER' },
};
const ENUM_REQUIRED_TRUE = {
  id: 'enumRequiredTrue',
  varType: 'enum',
  additionalData: {
    required: true,
    enumValues: [
      { key: 'A', value: 'A' },
      { key: 'B', value: 'B' },
    ],
  },
};
const ENUM_REQUIRED_FALSE = {
  id: 'enumRequiredFalse',
  varType: 'enum',
  additionalData: {
    required: false,
    enumValues: [
      { key: 'A', value: 'A' },
      { key: 'B', value: 'B' },
    ],
  },
};
const ENUM_REQUIRED_UNDEFINED = {
  id: 'enumRequiredUndefined',
  varType: 'enum',
  additionalData: {
    enumValues: [
      { key: 'A', value: 'A' },
      { key: 'B', value: 'B' },
    ],
  },
};
const RADIO_REQUIRED_TRUE = {
  id: 'radioRequiredTrue',
  varType: 'enum',
  additionalData: {
    subType: 'RADIO',
    required: true,
    enumValues: [
      { key: 'A', value: 'A' },
      { key: 'B', value: 'B' },
    ],
  },
};
const RADIO_REQUIRED_FALSE = {
  id: 'radioRequiredFalse',
  varType: 'enum',
  additionalData: {
    subType: 'RADIO',
    required: false,
    enumValues: [
      { key: 'A', value: 'A' },
      { key: 'B', value: 'B' },
    ],
  },
};
const RADIO_REQUIRED_UNDEFINED = {
  id: 'radioRequiredUndefined',
  varType: 'enum',
  additionalData: {
    subType: 'RADIO',
    enumValues: [
      { key: 'A', value: 'A' },
      { key: 'B', value: 'B' },
    ],
  },
};

export const NOT_IMPACTED_BY_REQUIRED_PARAMETERS = [
  BOOL_REQUIRED_TRUE,
  BOOL_REQUIRED_FALSE,
  BOOL_REQUIRED_UNDEFINED,
  SLIDER_REQUIRED_TRUE,
  SLIDER_REQUIRED_FALSE,
  SLIDER_REQUIRED_UNDEFINED,
  ENUM_REQUIRED_TRUE,
  ENUM_REQUIRED_FALSE,
  ENUM_REQUIRED_UNDEFINED,
  RADIO_REQUIRED_TRUE,
  RADIO_REQUIRED_FALSE,
  RADIO_REQUIRED_UNDEFINED,
];

// requiredEnabledInConfig test case
const SCENARIO_REQUIRED_TRUE = {
  id: 'scenarioRequiredTrue',
  varType: 'enum',
  additionalData: {
    subType: 'SCENARIOS',
    required: true,
  },
};
const LIST_REQUIRED_TRUE = {
  id: 'listRequiredTrue',
  varType: 'list',
  additionalData: {
    required: true,
    enumValues: [
      { key: 'A', value: 'A' },
      { key: 'B', value: 'B' },
    ],
  },
};
const NUMBER_REQUIRED_TRUE = { id: 'numberRequiredTrue', varType: 'number', additionalData: { required: true } };
const INT_REQUIRED_TRUE = { id: 'intRequiredTrue', varType: 'int', additionalData: { required: true } };
const STRING_REQUIRED_TRUE = { id: 'stringRequiredTrue', varType: 'string', additionalData: { required: true } };
const STRING_REQUIRED_UNDEFINED_MIN_LENGTH_1 = {
  id: 'stringRequiredUndefinedMinLength1',
  varType: 'string',
  additionalData: { minLength: 1 },
};
const FILE_REQUIRED_TRUE = {
  id: 'fileRequiredTrue',
  varType: '%DATASET_PART_ID_FILE%',
  additionalData: { required: true },
};
const TABLE_REQUIRED_TRUE = {
  id: 'tableRequiredTrue',
  varType: '%DATASET_PART_ID_FILE%',
  additionalData: {
    subType: 'TABLE',
    required: true,
    canChangeRowsNumber: true,
    columns: [{ field: 'name' }],
  },
};

export const REQUIRED_ENABLED_IN_CONFIG_PARAMETERS = [
  SCENARIO_REQUIRED_TRUE,
  LIST_REQUIRED_TRUE,
  NUMBER_REQUIRED_TRUE,
  INT_REQUIRED_TRUE,
  STRING_REQUIRED_TRUE,
  STRING_REQUIRED_UNDEFINED_MIN_LENGTH_1,
  FILE_REQUIRED_TRUE,
  TABLE_REQUIRED_TRUE,
];

// requiredDisabledInConfig test case
const SCENARIO_REQUIRED_FALSE = {
  id: 'scenarioRequiredFalse',
  varType: 'enum',
  additionalData: {
    subType: 'SCENARIOS',
    required: false,
  },
};
const DATE_REQUIRED_FALSE = { id: 'dateRequiredFalse', varType: 'date', additionalData: { required: false } };
const STRING_REQUIRED_FALSE = { id: 'stringRequiredFalse', varType: 'string', additionalData: { required: false } };
const STRING_REQUIRED_FALSE_MIN_LENGTH_1 = {
  id: 'stringRequiredFalseMinLength1',
  varType: 'string',
  additionalData: { required: false, minLength: 2 },
};
const ENUM_REQUIRED_FALSE_NO_ENUM_VALUES = {
  id: 'enumRequiredFalse_noEnumValues',
  varType: 'enum',
  additionalData: { required: false },
};
const LIST_REQUIRED_FALSE_NO_ENUM_VALUES = {
  id: 'listRequiredFalse_noEnumValues',
  varType: 'list',
  additionalData: { required: false },
};
const LIST_REQUIRED_FALSE = {
  id: 'listRequiredFalse',
  varType: 'list',
  additionalData: {
    required: false,
    enumValues: [
      { key: 'A', value: 'A' },
      { key: 'B', value: 'B' },
    ],
  },
};
const NUMBER_REQUIRED_FALSE = { id: 'numberRequiredFalse', varType: 'number', additionalData: { required: false } };
const INT_REQUIRED_FALSE = { id: 'intRequiredFalse', varType: 'int', additionalData: { required: false } };
const FILE_REQUIRED_FALSE = {
  id: 'fileRequiredFalse',
  varType: '%DATASET_PART_ID_FILE%',
  additionalData: { required: false },
};
const TABLE_REQUIRED_FALSE = {
  id: 'tableRequiredFalse',
  varType: '%DATASET_PART_ID_FILE%',
  additionalData: {
    subType: 'TABLE',
    required: false,
    canChangeRowsNumber: true,
    columns: [{ field: 'name' }],
  },
};

export const REQUIRED_DISABLED_IN_CONFIG_PARAMETERS = [
  SCENARIO_REQUIRED_FALSE,
  DATE_REQUIRED_FALSE,
  STRING_REQUIRED_FALSE,
  STRING_REQUIRED_FALSE_MIN_LENGTH_1,
  ENUM_REQUIRED_FALSE_NO_ENUM_VALUES,
  LIST_REQUIRED_FALSE_NO_ENUM_VALUES,
  LIST_REQUIRED_FALSE,
  NUMBER_REQUIRED_FALSE,
  INT_REQUIRED_FALSE,
  FILE_REQUIRED_FALSE,
  TABLE_REQUIRED_FALSE,
];

// requiredByDefault test case
const DATE_REQUIRED_UNDEFINED = { id: 'dateRequiredUndefined', varType: 'date' };
const NUMBER_REQUIRED_UNDEFINED = { id: 'numberRequiredUndefined', varType: 'number' };
const INT_REQUIRED_UNDEFINED = { id: 'intRequiredUndefined', varType: 'int' };

export const REQUIRED_BY_DEFAULT_PARAMETERS = [
  DATE_REQUIRED_UNDEFINED,
  NUMBER_REQUIRED_UNDEFINED,
  INT_REQUIRED_UNDEFINED,
];

// notRequiredByDefault test case
const ENUM_REQUIRED_UNDEFINED_NO_ENUM_VALUES = { id: 'enumRequiredUndefined_noEnumValues', varType: 'enum' };
const LIST_REQUIRED_UNDEFINED_NO_ENUM_VALUES = { id: 'listRequiredUndefined_noEnumValues', varType: 'list' };
const SCENARIO_REQUIRED_UNDEFINED = {
  id: 'scenarioRequiredUndefined',
  varType: 'enum',
  additionalData: {
    subType: 'SCENARIOS',
  },
};
const STRING_REQUIRED_UNDEFINED = { id: 'stringRequiredUndefined', varType: 'string' };
const LIST_REQUIRED_UNDEFINED = {
  id: 'listRequiredUndefined',
  varType: 'list',
  additionalData: {
    enumValues: [
      { key: 'A', value: 'A' },
      { key: 'B', value: 'B' },
    ],
  },
};
const FILE_REQUIRED_UNDEFINED = { id: 'fileRequiredUndefined', varType: '%DATASET_PART_ID_FILE%' };
const TABLE_REQUIRED_UNDEFINED = {
  id: 'tableRequiredUndefined',
  varType: '%DATASET_PART_ID_FILE%',
  additionalData: {
    subType: 'TABLE',
    canChangeRowsNumber: true,
    columns: [{ field: 'name' }],
  },
};

export const NOT_REQUIRED_BY_DEFAULT_PARAMETERS = [
  ENUM_REQUIRED_UNDEFINED_NO_ENUM_VALUES,
  LIST_REQUIRED_UNDEFINED_NO_ENUM_VALUES,
  SCENARIO_REQUIRED_UNDEFINED,
  STRING_REQUIRED_UNDEFINED,
  LIST_REQUIRED_UNDEFINED,
  FILE_REQUIRED_UNDEFINED,
  TABLE_REQUIRED_UNDEFINED,
];

export const ALL_PARAMETERS = [
  ...REQUIRED_ENABLED_WITH_INCONSISTENT_CONFIG_PARAMETERS,
  ...NOT_IMPACTED_BY_REQUIRED_PARAMETERS,
  ...REQUIRED_ENABLED_IN_CONFIG_PARAMETERS,
  ...REQUIRED_DISABLED_IN_CONFIG_PARAMETERS,
  ...REQUIRED_BY_DEFAULT_PARAMETERS,
  ...NOT_REQUIRED_BY_DEFAULT_PARAMETERS,
];
