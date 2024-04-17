// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DATASET_ID_VARTYPE } from '../../../services/config/ApiConstants';

export const GENERIC_VAR_TYPES_DEFAULT_VALUES = {
  enum: null, // default value must be defined by integrator in config
  string: '',
  int: 0,
  number: 0,
  bool: false,
  date: new Date(),
  list: [],
  [DATASET_ID_VARTYPE]: null, // "%DATASETID%" varType, null when unspecified
};
