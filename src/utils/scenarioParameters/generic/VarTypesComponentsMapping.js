// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import {
  GenericDateInput,
  GenericEnumInput,
  GenericMultiSelect,
  GenericNumberInput,
  GenericSliderInput,
  GenericRadioInput,
  GenericTable,
  GenericTextInput,
  GenericToggleInput,
  GenericUploadFile,
  ScenarioSelect,
} from '../../../components/ScenarioParameters/components/ScenarioParametersInputs';
import { DATASET_ID_VARTYPE } from '../../../services/config/ApiConstants';

export const GENERIC_VAR_TYPES_COMPONENTS_MAPPING = {
  bool: GenericToggleInput,
  date: GenericDateInput,
  enum: GenericEnumInput,
  'enum-RADIO': GenericRadioInput,
  'enum-SCENARIOS': ScenarioSelect,
  list: GenericMultiSelect,
  int: GenericNumberInput,
  'number-SLIDER': GenericSliderInput,
  number: GenericNumberInput,
  string: GenericTextInput,
  [DATASET_ID_VARTYPE]: GenericUploadFile,
  [DATASET_ID_VARTYPE + '-TABLE']: GenericTable,
};
