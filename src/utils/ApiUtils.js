// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import rfdc from 'rfdc';
import { VAR_TYPES_TO_STRING_FUNCTIONS } from './scenarioParameters/ConversionToString';
import { VAR_TYPES_FROM_STRING_FUNCTIONS } from './scenarioParameters/ConversionFromString.js';
import { ConfigUtils } from './ConfigUtils';
import { SCENARIO_PARAMETERS_CONFIG } from '../config/ScenarioParameters';

const clone = rfdc();

function _formatParameters(parameters, conversionArray) {
  const newParams = parameters.map((param) => {
    const extendedVarType = ConfigUtils.getExtendedVarType(param.parameterId, SCENARIO_PARAMETERS_CONFIG?.parameters);
    const convertMethod = ConfigUtils.getConversionMethod(param, extendedVarType, conversionArray);
    // Clone the original parameter to prevent undesired modifications
    const newParam = clone(param);
    if (convertMethod) {
      newParam.value = convertMethod(newParam.value);
    }
    return newParam;
  });
  return newParams;
}

// Reformat scenario parameters to match the API expected types
export function formatParametersForApi(parameters) {
  const newParams = _formatParameters(parameters, VAR_TYPES_TO_STRING_FUNCTIONS);
  return { parametersValues: newParams };
}

// Reformat scenario parameters to match the front-end expected types
export function formatParametersFromApi(parameters) {
  if (!parameters) {
    return undefined;
  }
  const newParams = _formatParameters(parameters, VAR_TYPES_FROM_STRING_FUNCTIONS);
  return newParams;
}
