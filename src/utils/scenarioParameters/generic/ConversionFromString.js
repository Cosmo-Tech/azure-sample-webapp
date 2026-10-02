// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DateUtils } from '@cosmotech/core';
import { FILE_DATASET_PART_ID_VARTYPE } from '../../../services/config/ApiConstants';

function _convertEnumFromString(parameterValue) {
  if (parameterValue === '') return null;
  return parameterValue; // Already a string
}

function _convertStringFromString(parameterValue) {
  return parameterValue; // Already a string
}

function _convertIntFromString(parameterValue) {
  if (parameterValue === '') return null;
  return parseInt(parameterValue);
}

function _convertNumberFromString(parameterValue) {
  if (parameterValue === '') return null;
  return parseFloat(parameterValue);
}

function _convertBoolFromString(parameterValue) {
  return parameterValue === 'true';
}

function _convertDateFromString(parameterValue) {
  if (parameterValue === '') return null;

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
  // DEPRECATED: Since API v5.0.0, dataset part parameters should no longer be stored as string parameter values by the
  // back-end
  console.warn(
    `Unexpected parameter value of type ${FILE_DATASET_PART_ID_VARTYPE}. Please make sure your runner ` +
      ' parameter values have been migrated to API v5'
  );
  if (parameterValue === '') return null;
  return parameterValue; // Already a string
}

function _convertListFromString(parameterValue) {
  if (parameterValue === '') return [];
  try {
    const parsedValue = JSON.parse(parameterValue);
    if (Array.isArray(parsedValue)) {
      return parsedValue;
    } else {
      console.warn(`Value ${parameterValue} cannot be parsed as an array`);
      return [];
    }
  } catch (error) {
    console.error(error);
    console.warn(`Value ${parameterValue} does not match JSON format`);
    return [];
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
  [FILE_DATASET_PART_ID_VARTYPE]: _convertDatasetIdFromString,
};
