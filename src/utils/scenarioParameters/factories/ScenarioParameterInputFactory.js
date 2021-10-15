// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { DATASET_ID_VARTYPE } from '../../../services/config/ApiConstants';
import { VAR_TYPES_FACTORIES_MAPPING } from '../FactoriesMapping';

const create = (t, datasets, parameterData, parametersState, setParametersState, editMode) => {
  const varTypeFactory = VAR_TYPES_FACTORIES_MAPPING[parameterData.varType];
  if (varTypeFactory === undefined) {
    console.warn('No factory defined for varType ' + parameterData.varType);
    return null;
  }
  if (varTypeFactory === null) {
    return null;
  }

  if (parameterData.varType === DATASET_ID_VARTYPE) {
    return varTypeFactory.create(t, datasets, parameterData, parametersState, setParametersState, editMode);
  }
  return varTypeFactory.create(t, parameterData, parametersState, setParametersState, editMode);
};

export const ScenarioParameterInputFactory = {
  create,
};
