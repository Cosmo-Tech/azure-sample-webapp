// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import rfdc from 'rfdc';
import { VAR_TYPES_TO_STRING_FUNCTIONS } from './scenarioParameters/ConversionToString';
import { VAR_TYPES_FROM_STRING_FUNCTIONS } from './scenarioParameters/ConversionFromString.js';

const clone = rfdc();

// Reformat scenario parameters to match the API expected types
export function formatParametersForApi (parameters) {
  const newParams = parameters.map(param => {
    // Clone the original parameter to prevent undesired modifications
    const newParam = clone(param);

    const paramVarType = param.varType;
    if (paramVarType in VAR_TYPES_TO_STRING_FUNCTIONS) {
      const convertToString = VAR_TYPES_TO_STRING_FUNCTIONS[paramVarType];
      newParam.value = convertToString(newParam.value);
    } else {
      console.warn(`No conversion function (to string) defined for varType "${paramVarType}"`);
    }
    return newParam;
  });

  return { parametersValues: newParams };
}

// Reformat scenario parameters to match the front-end expected types
export function formatParametersFromApi (parameters) {
  if (!parameters) {
    return undefined;
  }
  return parameters.map(param => {
    // Clone the original parameter to prevent undesired modifications
    const newParam = clone(param);

    const paramVarType = param.varType;
    if (paramVarType in VAR_TYPES_FROM_STRING_FUNCTIONS) {
      const convertFromString = VAR_TYPES_FROM_STRING_FUNCTIONS[paramVarType];
      newParam.value = convertFromString(newParam.value);
    } else {
      console.warn(`No conversion function (from string) defined for varType "${paramVarType}"`);
    }
    return newParam;
  });
}
