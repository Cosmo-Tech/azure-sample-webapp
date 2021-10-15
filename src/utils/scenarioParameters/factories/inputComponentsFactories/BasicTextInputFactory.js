// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { BasicTextInput } from '@cosmotech/ui';

const create = (t, parameterData, parametersState, setParametersState, editMode) => {
  const textFieldProps = {
    disabled: !editMode,
    id: parameterData.id,
  };

  function setValue(newValue) {
    setParametersState({
      ...parametersState,
      [parameterData.id]: newValue,
    });
  }

  return (
    <BasicTextInput
      key={parameterData.id}
      data-cy={parameterData.dataCy} // Optional data for cypress
      label={t(`solution.parameters.${parameterData.id}`, parameterData.id)}
      value={parametersState[parameterData.id] || ''}
      changeTextField={setValue}
      textFieldProps={textFieldProps}
    />
  );
};

export const BasicTextInputFactory = {
  create,
};
