// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { BasicNumberInput } from '@cosmotech/ui';

const DEFAULT_MIN_VALUE = -1e10 + 1;
const DEFAULT_MAX_VALUE = 1e10 - 1;

function getMinValue(parameterData) {
  if (parameterData.minValue === null || parameterData.minValue === undefined) {
    return DEFAULT_MIN_VALUE;
  }
  return parameterData.minValue;
}

function getMaxValue(parameterData) {
  if (parameterData.maxValue === null || parameterData.maxValue === undefined) {
    return DEFAULT_MAX_VALUE;
  }
  return parameterData.maxValue;
}

const create = (t, parameterData, parametersState, setParametersState, editMode) => {
  const inputProps = {
    min: getMinValue(parameterData),
    max: getMaxValue(parameterData),
  };
  const textFieldProps = {
    disabled: !editMode,
    id: parameterData.id,
  };

  function setValue(newValue) {
    setParametersState((currentParametersState) => ({
      ...currentParametersState,
      [parameterData.id]: newValue,
    }));
  }

  let value = parametersState[parameterData.id];
  if (value == null) {
    value = NaN;
  }

  return (
    <BasicNumberInput
      key={parameterData.id}
      data-cy={parameterData.dataCy}
      label={t(`solution.parameters.${parameterData.id}`, parameterData.id)}
      value={value}
      changeNumberField={setValue}
      textFieldProps={textFieldProps}
      inputProps={inputProps}
    />
  );
};

export const BasicNumberInputFactory = {
  create,
};
