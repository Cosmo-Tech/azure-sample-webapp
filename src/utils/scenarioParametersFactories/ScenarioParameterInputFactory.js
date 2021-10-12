// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import {
  BasicDateInputFactory,
  BasicEnumInputFactory,
  BasicNumberInputFactory,
  BasicTextInputFactory,
  BasicToggleInputFactory,
  UploadFileFactory
} from './inputComponentsFactories';
import { DATASET_ID_VARTYPE } from '../../services/config/ApiConstants';

const VAR_TYPE_FACTORY_MAPPING = {
  bool: BasicToggleInputFactory,
  date: BasicDateInputFactory,
  enum: BasicEnumInputFactory,
  int: BasicNumberInputFactory,
  number: BasicNumberInputFactory,
  string: BasicTextInputFactory,
  [DATASET_ID_VARTYPE]: UploadFileFactory
};

const create = (t, datasets, parameterData, parametersState, setParametersState, editMode) => {
  const varTypeFactory = VAR_TYPE_FACTORY_MAPPING[parameterData.varType];
  if (varTypeFactory === undefined) {
    console.warn('No factory defined for varType ' + parameterData.varType);
    return null;
  }
  if (varTypeFactory === null) {
    return null;
  }

  if (parameterData.varType === DATASET_ID_VARTYPE) {
    return varTypeFactory.create(t, datasets, parameterData, parametersState, setParametersState, editMode);
  }
  return varTypeFactory.create(t, parameterData, parametersState, setParametersState, editMode);
};

export const ScenarioParameterInputFactory = {
  create
};
