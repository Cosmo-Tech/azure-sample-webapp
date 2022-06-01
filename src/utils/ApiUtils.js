// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import rfdc from 'rfdc';
import { VAR_TYPES_TO_STRING_FUNCTIONS } from './scenarioParameters/ConversionToString';
import { VAR_TYPES_FROM_STRING_FUNCTIONS } from './scenarioParameters/ConversionFromString.js';
import { ConfigUtils } from './ConfigUtils';
import { SCENARIO_PARAMETERS_CONFIG } from '../config/ScenarioParameters';
import { APPLICATION_ACTIONS_KEY } from '../state/commons/ApplicationConstants';

const clone = rfdc();

function _formatParameters(parameters, conversionArray) {
  const newParams = parameters.map((param) => {
    const subType = ConfigUtils.getParameterSubType(param.parameterId, SCENARIO_PARAMETERS_CONFIG?.parameters);
    const conversionMethod = ConfigUtils.getConversionMethod(param, subType, conversionArray);
    // Clone the original parameter to prevent undesired modifications
    const newParam = clone(param);
    if (conversionMethod) {
      newParam.value = conversionMethod(newParam.value);
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

// Catch non-critical errors to display in error banner
export function catchNonCriticalErrors(error, commentOnAppBehaviour) {
  return {
    type: APPLICATION_ACTIONS_KEY.GET_NON_CRITICAL_ERRORS,
    error: {
      title:
        error.response?.message || error.response?.data?.title || navigator.onLine
          ? 'Unknown error'
          : 'Network problem, please check your internet connexion',
      detail: error.response?.data?.detail || '',
      status: error.response?.data?.status || '',
      comment: commentOnAppBehaviour,
    },
  };
}
