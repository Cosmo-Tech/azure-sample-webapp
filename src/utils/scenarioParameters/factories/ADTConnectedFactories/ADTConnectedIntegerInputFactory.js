// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { Button } from '@material-ui/core';
import { BasicNumberInput } from '@cosmotech/ui';

const DEFAULT_MIN_VALUE = -1e10 + 1;
const DEFAULT_MAX_VALUE = 1e10 - 1;

const stockInputContainerStyle = {
  maxWidth: '300px',
};

const parameterContainerStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
};

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

  const resetFromADT = () => {
    setValue(0); // TODO: read value from ADT
  };

  return (
    <div style={parameterContainerStyle} key={parameterData.id}>
      <BasicNumberInput
        data-cy={parameterData.dataCy}
        style={stockInputContainerStyle}
        label={t(`solution.parameters.${parameterData.id}`, parameterData.id)}
        value={value}
        changeNumberField={setValue}
        textFieldProps={textFieldProps}
        inputProps={inputProps}
      />
      <Button color="primary" variant="contained" onClick={resetFromADT} disabled={!editMode}>
        Reset from ADT
      </Button>
    </div>
  );
};

export const ADTConnectedIntegerInputFactory = {
  create,
};
