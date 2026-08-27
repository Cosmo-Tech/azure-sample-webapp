// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import rfdc from 'rfdc';
import { DEFAULT_SOLUTION } from '../default';

const clone = rfdc();

const enumValues = [
  { key: 'A', value: 'Option A' },
  { key: 'B', value: 'Option B' },
];
export const ETL_BOOL = { id: 'etl_bool_param', varType: 'bool' };
export const ETL_DATE = { id: 'etl_date_param', varType: 'date', additionalData: { required: false } };
export const ETL_ENUM_PLAIN = { id: 'etl_enum_plain_param', varType: 'enum', additionalData: { enumValues } };
export const ETL_ENUM_RADIO = {
  id: 'etl_enum_radio_param',
  varType: 'enum',
  additionalData: { subType: 'RADIO', enumValues },
};
export const ETL_ENUM_SCENARIOS = {
  id: 'etl_enum_scenarios_param',
  varType: 'enum',
  additionalData: { subType: 'SCENARIOS', required: false },
};
export const ETL_LIST = { id: 'etl_list_param', varType: 'list', additionalData: { enumValues, required: false } };
export const ETL_NUMBER_PLAIN = {
  id: 'etl_number_plain_param',
  varType: 'number',
  additionalData: { required: false },
};
export const ETL_NUMBER_SLIDER = {
  id: 'etl_number_slider_param',
  varType: 'number',
  minValue: '0',
  maxValue: '100',
  additionalData: { required: false, subType: 'SLIDER' },
};
export const ETL_INT = { id: 'etl_int_param', varType: 'int', additionalData: { required: false } };
export const ETL_STRING = { id: 'etl_string_param', varType: 'string', additionalData: { required: false } };
export const ETL_FILE = {
  id: 'etl_file_param',
  varType: '%DATASET_PART_ID_FILE%',
  additionalData: { required: false },
};
export const ETL_TABLE = {
  id: 'etl_table_param',
  varType: '%DATASET_PART_ID_FILE%',
  additionalData: {
    subType: 'TABLE',
    required: false,
    canChangeRowsNumber: true,
    columns: [{ field: 'name' }],
  },
};

const ALL_PARAMETERS = [
  ETL_BOOL,
  ETL_DATE,
  ETL_ENUM_PLAIN,
  ETL_ENUM_RADIO,
  ETL_ENUM_SCENARIOS,
  ETL_LIST,
  ETL_NUMBER_PLAIN,
  ETL_NUMBER_SLIDER,
  ETL_INT,
  ETL_STRING,
  ETL_FILE,
  ETL_TABLE,
];

const ETL_ALL_TYPES_GROUP = { id: 'etl_all_types_group', parameters: ALL_PARAMETERS.map((parameter) => parameter.id) };
export const ETL_ALL_TYPES_RUN_TEMPLATE = {
  id: 'etl_all_types_template',
  name: 'ETL All Types',
  tags: ['etl_all_types_template', 'datasource'],
  parameterGroups: [ETL_ALL_TYPES_GROUP.id],
};

export const SOLUTION_WITH_ETL_ALL_TYPES = clone(DEFAULT_SOLUTION);
SOLUTION_WITH_ETL_ALL_TYPES.parameters = [...DEFAULT_SOLUTION.parameters, ...ALL_PARAMETERS];
SOLUTION_WITH_ETL_ALL_TYPES.parameterGroups = [...DEFAULT_SOLUTION.parameterGroups, ETL_ALL_TYPES_GROUP];
SOLUTION_WITH_ETL_ALL_TYPES.runTemplates = [...DEFAULT_SOLUTION.runTemplates, ETL_ALL_TYPES_RUN_TEMPLATE];
