// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DB_DATASET_PART_ID_VARTYPE, FILE_DATASET_PART_ID_VARTYPE } from '../../../services/config/ApiConstants';

export const GENERIC_VAR_TYPES_DEFAULT_VALUES = {
  enum: null, // default value must be defined by integrator in config
  string: '',
  int: 0,
  number: 0,
  bool: false,
  date: new Date(),
  list: [],
  [FILE_DATASET_PART_ID_VARTYPE]: null,
  [DB_DATASET_PART_ID_VARTYPE]: null,
};
