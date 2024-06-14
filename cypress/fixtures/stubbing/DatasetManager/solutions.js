// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_SOLUTION } from '../default';

export const CUSTOM_SUBDATASOURCES = [
  { id: 'no_filter', parameterGroups: [], tags: ['subdatasource'] },
  { id: 'enum_filter', parameterGroups: ['enumGroup'], tags: ['subdatasource'] },
  { id: 'list_filter', parameterGroups: ['listGroup'], tags: ['subdatasource'] },
  { id: 'string_filter', parameterGroups: ['stringGroup'], tags: ['subdatasource'] },
  { id: 'date_filter', parameterGroups: ['dateGroup'], tags: ['subdatasource'] },
];

export const SOLUTION = {
  ...DEFAULT_SOLUTION,
  parameters: [
    ...DEFAULT_SOLUTION.parameters,
    {
      id: 'etl_enum_parameter',
      varType: 'enum',
      enumValues: [
        { key: 'option1', value: 'Option 1' },
        { key: 'option2', value: 'Option 2' },
      ],
    },
    {
      id: 'etl_list_parameter',
      varType: 'list',
      enumValues: [
        { key: 'option1', value: 'Option 1' },
        { key: 'option2', value: 'Option 2' },
      ],
    },
    { id: 'etl_string_parameter', varType: 'string' },
    { id: 'etl_date_parameter', varType: 'date' },
  ],
  parameterGroups: [
    ...DEFAULT_SOLUTION.parameterGroups,
    { id: 'enumGroup', parameters: ['etl_enum_parameter'] },
    { id: 'listGroup', parameters: ['etl_list_parameter'] },
    { id: 'stringGroup', parameters: ['etl_string_parameter'] },
    { id: 'dateGroup', parameters: ['etl_date_parameter'] },
  ],
  runTemplates: [...DEFAULT_SOLUTION.runTemplates, ...CUSTOM_SUBDATASOURCES],
};

export const SOLUTION_WITH_DYNAMIC_VALUES = {
  ...DEFAULT_SOLUTION,
  parameters: [
    ...DEFAULT_SOLUTION.parameters,
    {
      id: 'etl_dynamic_values_enum_parameter',
      varType: 'enum',
      options: {
        dynamicEnumValues: {
          type: 'cypher',
          query: 'MATCH(n:Customer) RETURN n.id as customer_id',
          resultKey: 'customer_id',
        },
      },
    },
  ],
  parameterGroups: [
    ...DEFAULT_SOLUTION.parameterGroups,
    { id: 'dynamicValuesEnumGroup', parameters: ['etl_dynamic_values_enum_parameter'] },
  ],
  runTemplates: [
    ...DEFAULT_SOLUTION.runTemplates,
    { id: 'dynamic_values_enum_filter', parameterGroups: ['dynamicValuesEnumGroup'], tags: ['subdatasource'] },
  ],
};
