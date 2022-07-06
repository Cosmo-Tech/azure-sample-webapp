// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { BasicTextInput } from '@cosmotech/ui';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

export const GenericTextInput = ({ parameterData, parametersState, setParametersState, context }) => {
  const { t } = useTranslation();
  const textFieldProps = {
    disabled: !context.editMode,
    id: parameterData.id,
  };

  function setValue(newValue) {
    setParametersState((currentParametersState) => ({
      ...currentParametersState,
      [parameterData.id]: newValue,
    }));
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
GenericTextInput.propTypes = {
  parameterData: PropTypes.object.isRequired,
  parametersState: PropTypes.object.isRequired,
  setParametersState: PropTypes.func.isRequired,
  context: PropTypes.object.isRequired,
};
