// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// To configure your scenario parameters see:
// https://github.com/Cosmo-Tech/azure-sample-webapp/blob/main/doc/scenarioParametersConfiguration.md

// Use the PARAMETERS dict below to override or add information to the scenario parameters defined in your solution
// description, such as:
//  - a default value for each scenario parameter on scenario creation
//  - lists of possible values for "enum" parameters
//  - translation labels
const PARAMETERS = {};

// Use the PARAMETERS_GROUPS dict below to override or add information to the parameters groups defined in your solution
// description, such as:
//  - translation labels
//  - list and order of the parameters of a group
// You can also create new groups that were not defined in the solution description: in this case don't forget to assign
// these parameters groups to a run template in the RUN_TEMPLATES dict
const PARAMETERS_GROUPS = {};

// Use RUN_TEMPLATES dict below to override information of the run templates defined in your solution description, such
// as:
//  - list and order of the parameters group to display for this run template
const RUN_TEMPLATES = {};

// Additional parameters to put in scenario parameters
export const ADD_SCENARIO_NAME_PARAMETER = false;
export const ADD_SCENARIO_ID_PARAMETER = false;
export const ADD_SCENARIO_LAST_RUN_ID_PARAMETER = false;
export const ADD_SCENARIO_PARENT_ID_PARAMETER = false;
export const ADD_SCENARIO_PARENT_LAST_RUN_ID_PARAMETER = false;
export const ADD_SCENARIO_MASTER_ID_PARAMETER = false;
export const ADD_SCENARIO_MASTER_LAST_RUN_ID_PARAMETER = false;
export const ADD_SCENARIO_RUN_TEMPLATE_NAME_PARAMETER = false;

export const SCENARIO_PARAMETERS_CONFIG = {
  parameters: PARAMETERS,
  parametersGroups: PARAMETERS_GROUPS,
  runTemplates: RUN_TEMPLATES,
};
