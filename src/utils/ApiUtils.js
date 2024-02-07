// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import rfdc from 'rfdc';
import ConfigService from '../services/ConfigService';
import { Api } from '../services/config/Api.js';
import { TWINGRAPH_SECTION_URL } from '../services/config/ApiConstants';
import { ConfigUtils } from './ConfigUtils';
import { VAR_TYPES_FROM_STRING_FUNCTIONS } from './scenarioParameters/ConversionFromString.js';
import { VAR_TYPES_TO_STRING_FUNCTIONS } from './scenarioParameters/ConversionToString';

const clone = rfdc();

const formatParameterMinMaxDefaultValuesFromString = (parameter) => {
  const castFunction = ConfigUtils.getConversionMethod(parameter, VAR_TYPES_FROM_STRING_FUNCTIONS);
  if (castFunction !== undefined) {
    const keysToCast = ['defaultValue', 'minValue', 'maxValue'];
    keysToCast.forEach((keyToCast) => {
      try {
        if (parameter[keyToCast] != null) parameter[keyToCast] = castFunction(parameter[keyToCast]);
      } catch (error) {
        console.error(error);
        console.log(
          `Error when trying to cast "${keyToCast}" of parameter with id "${parameter?.id}": its value is ` +
            `${parameter[keyToCast]}`
        );
      }
    });
  }
};

const _formatParameters = (parameters, conversionArray) => {
  const newParams = parameters.map((param) => {
    const conversionMethod = ConfigUtils.getConversionMethod(param, conversionArray);
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

const getDatasetApiUrl = (datasetId) => {
  const organizationId = ConfigService.getParameterValue('ORGANIZATION_ID');
  return `${Api.defaultBasePath}/organizations/${organizationId}/datasets/${datasetId}`;
};

const getDatasetTwingraphSwaggerSection = () => {
  return Api.defaultBasePath + TWINGRAPH_SECTION_URL;
};

export const ApiUtils = {
  formatParameterMinMaxDefaultValuesFromString,
  formatParametersForApi,
  formatParametersFromApi,
  getDatasetApiUrl,
  getDatasetTwingraphSwaggerSection,
};
