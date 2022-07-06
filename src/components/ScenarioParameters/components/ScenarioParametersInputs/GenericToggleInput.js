// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { BasicToggleInput } from '@cosmotech/ui';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

export const GenericToggleInput = ({ parameterData, parametersState, setParametersState, context }) => {
  const { t } = useTranslation();
  const switchFieldProps = {
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
    <BasicToggleInput
      key={parameterData.id}
      data-cy={parameterData.dataCy}
      label={t(`solution.parameters.${parameterData.id}`, parameterData.id)}
      value={parametersState[parameterData.id] || false}
      changeSwitchType={setValue}
      switchProps={switchFieldProps}
    />
  );
};
GenericToggleInput.propTypes = {
  parameterData: PropTypes.object.isRequired,
  parametersState: PropTypes.object.isRequired,
  setParametersState: PropTypes.func.isRequired,
  context: PropTypes.object.isRequired,
};
