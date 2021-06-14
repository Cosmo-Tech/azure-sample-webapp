// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

export const DATASET_PARAM_VARTYPE = '%DATASETID%';

const constructParameterData = (param, value) => {
  return {
    parameterId: param.id,
    varType: param.varType,
    value: value != null ? value : param.defaultValue
  };
};

export const ScenarioParametersUtils = {
  constructParameterData
};
