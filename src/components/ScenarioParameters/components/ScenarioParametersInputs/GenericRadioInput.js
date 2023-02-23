// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { BasicRadioInput } from '@cosmotech/ui';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { TranslationUtils, ConfigUtils } from '../../../../utils';

export const GenericRadioInput = ({ parameterData, context, parameterValue, setParameterValue }) => {
  const { t } = useTranslation();
  let enumValues = ConfigUtils.getParameterAttribute(parameterData, 'enumValues');
  const textFieldProps = {
    disabled: !context.editMode,
    id: parameterData.id,
  };

  if (!enumValues) {
    console.warn(
      `Enum values are not defined for scenario parameter "${parameterData.id}".\n` +
        'Please provide an array in the "options.enumValues" field for this parameter in the parameters' +
        'configuration file.'
    );
    enumValues = [];
  }

  return (
    <BasicRadioInput
      key={parameterData.id}
      data-cy={`radio-input-${parameterData.id}`}
      label={t(`solution.parameters.${parameterData.id}`, parameterData.id)}
      value={parameterValue ?? enumValues?.[0]?.key ?? ''}
      tooltipText={t(TranslationUtils.getParameterTooltipTranslationKey(parameterData.id), '')}
      disabled={!context.editMode}
      changeRadioOption={setParameterValue}
      textFieldProps={textFieldProps}
      enumValues={enumValues}
    />
  );
};
GenericRadioInput.propTypes = {
  parameterData: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  parameterValue: PropTypes.any,
  setParameterValue: PropTypes.func.isRequired,
};
