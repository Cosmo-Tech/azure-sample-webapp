// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { BasicEnumInput } from '@cosmotech/ui';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ConfigUtils } from '../../../../utils/ConfigUtils';

export const GenericEnumInput = ({ parameterData, parametersState, setParametersState, context }) => {
  const { t } = useTranslation();
  const textFieldProps = {
    disabled: !context.editMode,
    id: parameterData.id,
  };

  let enumValues = ConfigUtils.getParameterAttribute(parameterData, 'enumValues');
  if (!enumValues) {
    console.warn(
      `Enum values are not defined for scenario parameter "${parameterData.id}".\n` +
        'Please provide an array in the "options.enumValues" field for this parameter in the parameters ' +
        'configuration file.'
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
      data-cy={`enum-input-${parameterData.id}`}
      label={t(`solution.parameters.${parameterData.id}`, parameterData.id)}
      value={parametersState[parameterData.id] || enumValues?.[0]?.key || ''}
      changeEnumField={setValue}
      textFieldProps={textFieldProps}
      enumValues={enumValues}
    />
  );
};

GenericEnumInput.propTypes = {
  parameterData: PropTypes.object.isRequired,
  parametersState: PropTypes.object.isRequired,
  setParametersState: PropTypes.func.isRequired,
  context: PropTypes.object.isRequired,
};
