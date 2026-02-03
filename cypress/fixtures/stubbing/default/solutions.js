// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { ROLES } from '../../../commons/constants/generic/TestConstants';
import { DEFAULT_ORGANIZATION } from './organizations';
import { PARAMETER_GROUPS } from './runTemplateParameterGroups';
import { PARAMETERS } from './runTemplateParameters';
import {
  BREWERY_PARAMETERS_RUN_TEMPLATE,
  NO_PARAMETERS_RUN_TEMPLATE,
  BASIC_TYPES_PARAMETERS_RUN_TEMPLATE,
  HIDDEN_RUN_TEMPLATE,
  CUSTOM_SUBDATASOURCES,
  DYNAMIC_VALUES_ENUM_FILTER,
  ETL_RUN_TEMPLATE,
  PARTIALLY_PREFILLED_DATASOURCE,
  SUBDATASET_RUN_TEMPLATE,
} from './runTemplates';
import { USER_EXAMPLE } from './users';

export const DEFAULT_SOLUTION = {
  id: 'sol-stubbedbrwy',
  key: 'Demo Brewery Solution',
  name: 'Stubbed Demo Brewery Solution',
  description: 'One Day Brewery Solution',
  repository: 'brewery_simulator',
  version: '0.0.1-stubbedVersion',
  organizationId: DEFAULT_ORGANIZATION.id,
  createInfo: { timestamp: 1714487051204, userId: USER_EXAMPLE.email },
  updateInfo: { timestamp: 1714487051204, userId: USER_EXAMPLE.email },
  alwaysPull: true,
  sdkVersion: '12.34.56-789.1c411170',
  url: null,
  tags: ['1day', 'Brewery'],
  security: { default: ROLES.RUNNER.ADMIN, accessControlList: [] },
  parameters: [...Object.values(PARAMETERS)],
  parameterGroups: [...Object.values(PARAMETER_GROUPS)],
  runTemplates: [
    BREWERY_PARAMETERS_RUN_TEMPLATE,
    NO_PARAMETERS_RUN_TEMPLATE,
    BASIC_TYPES_PARAMETERS_RUN_TEMPLATE,
    HIDDEN_RUN_TEMPLATE,
    ...CUSTOM_SUBDATASOURCES,
    DYNAMIC_VALUES_ENUM_FILTER,
    ETL_RUN_TEMPLATE,
    PARTIALLY_PREFILLED_DATASOURCE,
    SUBDATASET_RUN_TEMPLATE,
  ],
};

export const DEFAULT_SOLUTIONS = [DEFAULT_SOLUTION];
