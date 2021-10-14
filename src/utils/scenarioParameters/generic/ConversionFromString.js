// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { DATASET_ID_VARTYPE } from '../../../services/config/ApiConstants';

function _convertEnumFromString (parameterValue) {
  return parameterValue; // Already a string
}

function _convertStringFromString (parameterValue) {
  return parameterValue; // Already a string
}

function _convertIntFromString (parameterValue) {
  return parseInt(parameterValue);
}

function _convertNumberFromString (parameterValue) {
  return parseFloat(parameterValue);
}

function _convertBoolFromString (parameterValue) {
  return (parameterValue === 'true');
}

function _convertDateFromString (parameterValue) {
  return new Date(parameterValue);
}

function _convertDatasetIdFromString (parameterValue) {
  return parameterValue; // Already a string
}

export const GENERIC_VAR_TYPES_FROM_STRING_FUNCTIONS = {
  enum: _convertEnumFromString,
  string: _convertStringFromString,
  int: _convertIntFromString,
  number: _convertNumberFromString,
  bool: _convertBoolFromString,
  date: _convertDateFromString,
  [DATASET_ID_VARTYPE]: _convertDatasetIdFromString // "%DATASETID%" varType
};
