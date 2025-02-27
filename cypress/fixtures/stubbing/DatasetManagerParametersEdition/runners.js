// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_RUNNER } from '../default';

const EDITABLE_RUNNER = {
  ...DEFAULT_RUNNER,
  status: 'Running',
  security: { default: 'admin', accessControlList: [] },
};

const RUNNER_ENUM_PARAMETER = {
  ...EDITABLE_RUNNER,
  id: 'r-stbdparams1',
  organizationId: 'O-stbdbrwry',
  name: 'ETL Runner with Enum Parameter',
  description: 'Runner for ETL with dynamic values enum parameter',
  tags: ['parameters', 'test', 'etl'],
  runTemplateId: 'etl_dynamic_values_enum_parameter',
  parametersValues: [
    {
      parameterId: 'etl_dynamic_values_enum_parameter',
      varType: 'enum',
      value: 'Second',
    },
  ],
};

const RUNNER_WITH_FILE = {
  ...EDITABLE_RUNNER,
  id: 'r-stbdparams2',
  organizationId: 'O-stbdbrwry',
  name: 'ETL Runner with File',
  description: 'Runner for ETL with file parameter',
  tags: ['parameters', 'test', 'etl'],
  runTemplateId: 'etl_with_file',
  parametersValues: [
    {
      parameterId: 'etl_file_parameter',
      varType: '%DATASETID%',
      value: 'D-stbdparams1',
    },
    {
      parameterId: 'etl_stock',
      varType: 'string',
      value: '150',
    },
  ],
};

const RUNNER_WITH_FILE_2 = {
  ...EDITABLE_RUNNER,
  id: 'r-stbdparams3',
  organizationId: 'O-stbdbrwry',
  name: 'ETL Runner with File 2',
  description: 'Runner for ETL with file parameter',
  tags: ['parameters', 'test', 'etl'],
  runTemplateId: 'etl_with_file',
  parametersValues: [
    {
      parameterId: 'etl_file_parameter',
      varType: '%DATASETID%',
      value: 'D-stbdparams6',
    },
    {
      parameterId: 'etl_stock',
      varType: 'string',
      value: '56',
    },
  ],
};

export const RUNNERS = [RUNNER_ENUM_PARAMETER, RUNNER_WITH_FILE, RUNNER_WITH_FILE_2];
