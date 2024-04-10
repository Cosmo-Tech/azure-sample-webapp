// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// Use the SOLUTIONS array below to override or add information to your solutions. This can be useful for development
// purposes, but it is recommended to leave this array empty and use the API to update your Solution instead for
// production environments.
export const SOLUTIONS = [
  {
    id: 'SOL-VkqXyNONQyB',
    parameters: [
      {
        id: 'etl_param_subdataset_filter_is_thirsty',
        varType: 'enum',
        options: {
          enumValues: undefined,
          dynamicEnumValues: {
            type: 'cypher',
            query: 'MATCH(n:Customer) RETURN n.id as id',
            resultKey: 'id',
          },
        },
      },
    ],
  },
];
