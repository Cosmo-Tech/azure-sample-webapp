// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { DATASET_ID_VARTYPE } from '../../../services/config/ApiConstants';
import { ConfigUtils } from '../../ConfigUtils';
import { GENERIC_VAR_TYPES_FACTORIES_MAPPING } from '../generic/FactoriesMapping';

const create = (t, datasets, parameterData, parametersState, setParametersState, editMode) => {
  const parameterVarType = ConfigUtils.buildExtendedVarType(parameterData.varType, parameterData.subType);
  let varTypeFactory;

  if (parameterVarType in GENERIC_VAR_TYPES_FACTORIES_MAPPING) {
    varTypeFactory = GENERIC_VAR_TYPES_FACTORIES_MAPPING[parameterVarType];
  } else {
    varTypeFactory = GENERIC_VAR_TYPES_FACTORIES_MAPPING[parameterData.varType];
  }

  if (varTypeFactory === undefined) {
    console.warn('No factory defined for varType ' + parameterVarType);
    return null;
  }
  if (varTypeFactory === null) {
    return null;
  }

  if (parameterVarType.startsWith(DATASET_ID_VARTYPE)) {
    return varTypeFactory.create(t, datasets, parameterData, parametersState, setParametersState, editMode);
  }
  return varTypeFactory.create(t, parameterData, parametersState, setParametersState, editMode);
};

export const ScenarioParameterInputFactory = {
  create,
};
