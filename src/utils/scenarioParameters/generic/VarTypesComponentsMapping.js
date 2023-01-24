// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { DATASET_ID_VARTYPE } from '../../../services/config/ApiConstants';
import {
  GenericDateInput,
  GenericEnumInput,
  GenericNumberInput,
  GenericSliderInput,
  GenericRadioInput,
  GenericTable,
  GenericTextInput,
  GenericToggleInput,
  GenericUploadFile,
} from '../../../components/ScenarioParameters/components/ScenarioParametersInputs';

export const GENERIC_VAR_TYPES_COMPONENTS_MAPPING = {
  bool: GenericToggleInput,
  date: GenericDateInput,
  enum: GenericEnumInput,
  'enum-RADIO': GenericRadioInput,
  int: GenericNumberInput,
  'number-SLIDER': GenericSliderInput,
  number: GenericNumberInput,
  string: GenericTextInput,
  [DATASET_ID_VARTYPE]: GenericUploadFile,
  [DATASET_ID_VARTYPE + '-TABLE']: GenericTable,
};
