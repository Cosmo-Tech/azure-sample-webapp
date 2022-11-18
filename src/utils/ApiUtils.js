// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import rfdc from 'rfdc';
import { VAR_TYPES_TO_STRING_FUNCTIONS } from './scenarioParameters/ConversionToString';
import { VAR_TYPES_FROM_STRING_FUNCTIONS } from './scenarioParameters/ConversionFromString.js';
import { ConfigUtils } from './ConfigUtils';
import { SCENARIO_PARAMETERS_CONFIG } from '../config/ScenarioParameters';

const clone = rfdc();

const formatParameterMinMaxDefaultValuesFromString = (parameter) => {
  const subType = ConfigUtils.getSubTypeFromParameter(parameter);
  const castFunction = ConfigUtils.getConversionMethod(parameter, subType, VAR_TYPES_FROM_STRING_FUNCTIONS);
  if (castFunction !== undefined) {
    const keysToCast = ['defaultValue', 'minValue', 'maxValue'];
    keysToCast.forEach((keyToCast) => {
      try {
        parameter[keyToCast] = parameter[keyToCast] != null ? castFunction(parameter[keyToCast]) : parameter[keyToCast];
      } catch (error) {
        console.log(
          `Error when trying to cast "${keyToCast}" of parameter with id "${parameter?.id}": its value is` +
            `${parameter[keyToCast]}`
        );
      }
    });
  }
};

const _formatParameters = (parameters, conversionArray) => {
  const newParams = parameters.map((param) => {
    const subType = ConfigUtils.getParameterSubTypeFromConfig(
      param.parameterId,
      SCENARIO_PARAMETERS_CONFIG?.parameters
    );
    const conversionMethod = ConfigUtils.getConversionMethod(param, subType, conversionArray);
    // Clone the original parameter to prevent undesired modifications
    const newParam = clone(param);
    if (conversionMethod) {
      newParam.value = conversionMethod(newParam.value);
    }
    return newParam;
  });
  return newParams;
};

// Reformat scenario parameters to match the API expected types
const formatParametersForApi = (parameters) => {
  const newParams = _formatParameters(parameters, VAR_TYPES_TO_STRING_FUNCTIONS);
  return { parametersValues: newParams };
};

// Reformat scenario parameters to match the front-end expected types
const formatParametersFromApi = (parameters) => {
  if (!parameters) {
    return undefined;
  }
  const newParams = _formatParameters(parameters, VAR_TYPES_FROM_STRING_FUNCTIONS);
  return newParams;
};

export const ApiUtils = {
  formatParameterMinMaxDefaultValuesFromString,
  formatParametersForApi,
  formatParametersFromApi,
};
