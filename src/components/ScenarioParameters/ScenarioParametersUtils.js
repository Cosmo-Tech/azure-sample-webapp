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

const getValueFromParameters = (parameters, parameterToSelect) => {
  if (!parameters) {
    return parameterToSelect.defaultValue;
  }
  const param = parameters.find(element => element.parameterId === parameterToSelect.id);
  if (param !== undefined) {
    return param.value;
  }
  return parameterToSelect.defaultValue;
};

export const ScenarioParametersUtils = {
  constructParameterData,
  getValueFromParameters
};
