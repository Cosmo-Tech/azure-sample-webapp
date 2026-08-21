// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_SIMULATION_RUNNER } from '../default';
import {
  REQUIRED_ENABLED_WITH_INCONSISTENT_CONFIG_RUN_TEMPLATE,
  NOT_IMPACTED_BY_REQUIRED_RUN_TEMPLATE,
  SCENARIO_REQUIRED_TRUE_RUN_TEMPLATE,
  LIST_REQUIRED_TRUE_RUN_TEMPLATE,
  NUMBER_REQUIRED_TRUE_RUN_TEMPLATE,
  INT_REQUIRED_TRUE_RUN_TEMPLATE,
  STRING_REQUIRED_TRUE_RUN_TEMPLATE,
  STRING_REQUIRED_UNDEFINED_MIN_LENGTH_1_RUN_TEMPLATE,
  FILE_REQUIRED_TRUE_RUN_TEMPLATE,
  TABLE_REQUIRED_TRUE_RUN_TEMPLATE,
  REQUIRED_DISABLED_IN_CONFIG_RUN_TEMPLATE,
  REQUIRED_BY_DEFAULT_RUN_TEMPLATE,
  NOT_REQUIRED_BY_DEFAULT_RUN_TEMPLATE,
} from './runTemplates';

export const REQUIRED_ENABLED_WITH_INCONSISTENT_CONFIG_SCENARIO = {
  ...DEFAULT_SIMULATION_RUNNER,
  id: 'r-requiredEnabledWithInconsistentConfig',
  name: 'Cypress - Required Enabled With Inconsistent Config',
  runTemplateId: REQUIRED_ENABLED_WITH_INCONSISTENT_CONFIG_RUN_TEMPLATE.id,
  runTemplateName: REQUIRED_ENABLED_WITH_INCONSISTENT_CONFIG_RUN_TEMPLATE.name,
};

export const NOT_IMPACTED_BY_REQUIRED_SCENARIO = {
  ...DEFAULT_SIMULATION_RUNNER,
  id: 'r-notImpactedByRequired',
  name: 'Cypress - Not Impacted By Required',
  runTemplateId: NOT_IMPACTED_BY_REQUIRED_RUN_TEMPLATE.id,
  runTemplateName: NOT_IMPACTED_BY_REQUIRED_RUN_TEMPLATE.name,
};

export const SCENARIO_REQUIRED_TRUE_SCENARIO = {
  ...DEFAULT_SIMULATION_RUNNER,
  id: 'r-scenarioRequiredTrue',
  name: 'Cypress - Scenario Required True',
  runTemplateId: SCENARIO_REQUIRED_TRUE_RUN_TEMPLATE.id,
  runTemplateName: SCENARIO_REQUIRED_TRUE_RUN_TEMPLATE.name,
};

export const LIST_REQUIRED_TRUE_SCENARIO = {
  ...DEFAULT_SIMULATION_RUNNER,
  id: 'r-listRequiredTrue',
  name: 'Cypress - List Required True',
  runTemplateId: LIST_REQUIRED_TRUE_RUN_TEMPLATE.id,
  runTemplateName: LIST_REQUIRED_TRUE_RUN_TEMPLATE.name,
};

export const NUMBER_REQUIRED_TRUE_SCENARIO = {
  ...DEFAULT_SIMULATION_RUNNER,
  id: 'r-numberRequiredTrue',
  name: 'Cypress - Number Required True',
  runTemplateId: NUMBER_REQUIRED_TRUE_RUN_TEMPLATE.id,
  runTemplateName: NUMBER_REQUIRED_TRUE_RUN_TEMPLATE.name,
};

export const INT_REQUIRED_TRUE_SCENARIO = {
  ...DEFAULT_SIMULATION_RUNNER,
  id: 'r-intRequiredTrue',
  name: 'Cypress - Int Required True',
  runTemplateId: INT_REQUIRED_TRUE_RUN_TEMPLATE.id,
  runTemplateName: INT_REQUIRED_TRUE_RUN_TEMPLATE.name,
};

export const STRING_REQUIRED_TRUE_SCENARIO = {
  ...DEFAULT_SIMULATION_RUNNER,
  id: 'r-stringRequiredTrue',
  name: 'Cypress - String Required True',
  runTemplateId: STRING_REQUIRED_TRUE_RUN_TEMPLATE.id,
  runTemplateName: STRING_REQUIRED_TRUE_RUN_TEMPLATE.name,
};

export const STRING_REQUIRED_UNDEFINED_MIN_LENGTH_1_SCENARIO = {
  ...DEFAULT_SIMULATION_RUNNER,
  id: 'r-stringRequiredUndefinedMinLength1',
  name: 'Cypress - String Required Undefined Min Length 1',
  runTemplateId: STRING_REQUIRED_UNDEFINED_MIN_LENGTH_1_RUN_TEMPLATE.id,
  runTemplateName: STRING_REQUIRED_UNDEFINED_MIN_LENGTH_1_RUN_TEMPLATE.name,
};

export const FILE_REQUIRED_TRUE_SCENARIO = {
  ...DEFAULT_SIMULATION_RUNNER,
  id: 'r-fileRequiredTrue',
  name: 'Cypress - File Required True',
  runTemplateId: FILE_REQUIRED_TRUE_RUN_TEMPLATE.id,
  runTemplateName: FILE_REQUIRED_TRUE_RUN_TEMPLATE.name,
};

export const TABLE_REQUIRED_TRUE_SCENARIO = {
  ...DEFAULT_SIMULATION_RUNNER,
  id: 'r-tableRequiredTrue',
  name: 'Cypress - Table Required True',
  runTemplateId: TABLE_REQUIRED_TRUE_RUN_TEMPLATE.id,
  runTemplateName: TABLE_REQUIRED_TRUE_RUN_TEMPLATE.name,
};

export const REQUIRED_DISABLED_IN_CONFIG_SCENARIO = {
  ...DEFAULT_SIMULATION_RUNNER,
  id: 'r-requiredDisabledInConfig',
  name: 'Cypress - Required Disabled In Config',
  runTemplateId: REQUIRED_DISABLED_IN_CONFIG_RUN_TEMPLATE.id,
  runTemplateName: REQUIRED_DISABLED_IN_CONFIG_RUN_TEMPLATE.name,
};

export const REQUIRED_BY_DEFAULT_SCENARIO = {
  ...DEFAULT_SIMULATION_RUNNER,
  id: 'r-requiredByDefault',
  name: 'Cypress - Required By Default',
  runTemplateId: REQUIRED_BY_DEFAULT_RUN_TEMPLATE.id,
  runTemplateName: REQUIRED_BY_DEFAULT_RUN_TEMPLATE.name,
};

export const NOT_REQUIRED_BY_DEFAULT_SCENARIO = {
  ...DEFAULT_SIMULATION_RUNNER,
  id: 'r-notRequiredByDefault',
  name: 'Cypress - Not Required By Default',
  runTemplateId: NOT_REQUIRED_BY_DEFAULT_RUN_TEMPLATE.id,
  runTemplateName: NOT_REQUIRED_BY_DEFAULT_RUN_TEMPLATE.name,
};
