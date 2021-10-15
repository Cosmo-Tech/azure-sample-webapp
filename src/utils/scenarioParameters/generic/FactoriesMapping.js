// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { DATASET_ID_VARTYPE } from '../../../services/config/ApiConstants';
import {
  BasicDateInputFactory,
  BasicEnumInputFactory,
  BasicNumberInputFactory,
  BasicTextInputFactory,
  BasicToggleInputFactory,
  UploadFileFactory
} from '../factories/inputComponentsFactories';

export const GENERIC_VAR_TYPES_FACTORIES_MAPPING = {
  bool: BasicToggleInputFactory,
  date: BasicDateInputFactory,
  enum: BasicEnumInputFactory,
  int: BasicNumberInputFactory,
  number: BasicNumberInputFactory,
  string: BasicTextInputFactory,
  [DATASET_ID_VARTYPE]: UploadFileFactory
};
