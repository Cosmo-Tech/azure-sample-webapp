// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { BasicEnumInput } from '@cosmotech/ui';

const create = (t, parameterData, parametersState, setParametersState, editMode) => {
  let enumValues = parameterData.enumValues;
  const textFieldProps = {
    disabled: !editMode,
    id: parameterData.id,
  };

  if (!enumValues) {
    console.warn(
      `Enum values are not defined for scenario parameter "${parameterData.id}".\n` +
        'Please provide an array in the "enumValues" field for this parameter in the parameters configuration file.'
    );
    enumValues = [];
  }

  function setValue(newValue) {
    setParametersState((currentParametersState) => ({
      ...currentParametersState,
      [parameterData.id]: newValue,
    }));
  }

  return (
    <BasicEnumInput
      key={parameterData.id}
      data-cy={parameterData.dataCy} // Optional data for cypress
      label={t(`solution.parameters.${parameterData.id}`, parameterData.id)}
      value={parametersState[parameterData.id] || enumValues?.[0]?.key || ''}
      changeEnumField={setValue}
      textFieldProps={textFieldProps}
      enumValues={enumValues}
    />
  );
};

export const BasicEnumInputFactory = {
  create,
};
