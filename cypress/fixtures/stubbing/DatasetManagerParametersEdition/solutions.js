// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { ROLES } from '../../../commons/constants/generic/TestConstants';
import { DEFAULT_SOLUTION } from '../default';

export const SOLUTION = {
  ...DEFAULT_SOLUTION,
  security: {
    default: ROLES.SCENARIO.ADMIN,
    accessControlList: [],
  },
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
    {
      id: 'etl_file_parameter',
      varType: '%DATASETID%',
      options: {
        connectorId: 'c-stbdcnctr',
      },
    },
    {
      id: 'etl_stock',
      varType: 'string',
      defaultValue: '100',
    },
  ],
  parameterGroups: [
    ...DEFAULT_SOLUTION.parameterGroups,
    { id: 'etl_dynamic_values_enum_group', parameters: ['etl_dynamic_values_enum_parameter'] },
    { id: 'etl_with_local_file', parameters: ['etl_file_parameter', 'etl_stock'] },
  ],
  runTemplates: [
    ...DEFAULT_SOLUTION.runTemplates,
    {
      id: 'etl_dynamic_values_enum_parameter',
      labels: {
        en: 'ETL with dynamic values',
        fr: 'ETL avec un filtre dynamique',
      },
      parameterGroups: ['etl_dynamic_values_enum_group'],
      tags: ['subdatasource'],
    },
    {
      id: 'etl_with_file',
      labels: {
        en: 'ETL with local file',
        fr: 'ETL avec un fichier local',
      },
      parameterGroups: ['etl_with_local_file'],
      tags: ['datasource'],
    },
  ],
};
