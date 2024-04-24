// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DateUtils } from '@cosmotech/core';
import { DATASET_ID_VARTYPE } from '../../../services/config/ApiConstants';

function _convertEnumFromString(parameterValue) {
  return parameterValue; // Already a string
}

function _convertStringFromString(parameterValue) {
  return parameterValue; // Already a string
}

function _convertIntFromString(parameterValue) {
  return parseInt(parameterValue);
}

function _convertNumberFromString(parameterValue) {
  return parseFloat(parameterValue);
}

function _convertBoolFromString(parameterValue) {
  return parameterValue === 'true';
}

function _convertDateFromString(parameterValue) {
  let parsedDate = DateUtils.parseISO(parameterValue);
  if (!DateUtils.isValidDate(parsedDate)) {
    parsedDate = new Date(parameterValue);
    if (!DateUtils.isValidDate(parsedDate)) {
      console.error(`Value "${parameterValue}" of date parameter couldn't be parsed.`);
    } else {
      console.warn(
        `Value ${parameterValue} of date parameter does not match ISO format. Behavior may be inconsistent if ` +
          'timezones are not defined.'
      );
    }
  }
  return DateUtils.getDateAtMidnightUTC(parsedDate);
}

function _convertDatasetIdFromString(parameterValue) {
  return parameterValue; // Already a string
}

function _convertListFromString(parameterValue) {
  try {
    const parsedValue = JSON.parse(parameterValue);
    if (Array.isArray(parsedValue)) {
      return parsedValue;
    } else {
      console.warn(`Value ${parameterValue} cannot be parsed as an array`);
      return [];
    }
  } catch (error) {
    console.warn(`Value ${parameterValue} does not match JSON format`);
  }
}

export const GENERIC_VAR_TYPES_FROM_STRING_FUNCTIONS = {
  enum: _convertEnumFromString,
  string: _convertStringFromString,
  int: _convertIntFromString,
  number: _convertNumberFromString,
  bool: _convertBoolFromString,
  date: _convertDateFromString,
  list: _convertListFromString,
  [DATASET_ID_VARTYPE]: _convertDatasetIdFromString, // "%DATASETID%" varType
};
