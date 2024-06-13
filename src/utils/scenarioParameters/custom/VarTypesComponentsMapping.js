// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
// You can define here the input components mapping for the custom varTypes of your solution
// See ../generic/VarTypesComponentsMapping.js for some examples
import { CypherTable } from '../../../components/ScenarioParameters/components/ScenarioParametersInputs';
import { DATASET_ID_VARTYPE } from '../../../services/config/ApiConstants';

export const CUSTOM_VAR_TYPES_COMPONENTS_MAPPING = {
  [DATASET_ID_VARTYPE + '-GRAPHTABLE']: CypherTable,
};
