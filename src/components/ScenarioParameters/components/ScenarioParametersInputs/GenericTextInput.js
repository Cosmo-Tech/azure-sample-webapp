// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { BasicTextInput } from '@cosmotech/ui';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { TranslationUtils } from '../../../../utils';

export const GenericTextInput = ({ parameterData, context, parameterValue, setParameterValue, isDirty }) => {
  const { t } = useTranslation();
  const textFieldProps = {
    disabled: !context.editMode,
    id: `text-input-${parameterData.id}`,
  };

  return (
    <BasicTextInput
      key={parameterData.id}
      id={parameterData.id}
      label={t(TranslationUtils.getParameterTranslationKey(parameterData.id), parameterData.id)}
      tooltipText={t(TranslationUtils.getParameterTooltipTranslationKey(parameterData.id), '')}
      value={parameterValue ?? ''}
      changeTextField={setParameterValue}
      textFieldProps={textFieldProps}
      isDirty={isDirty}
    />
  );
};

GenericTextInput.propTypes = {
  parameterData: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  parameterValue: PropTypes.any,
  setParameterValue: PropTypes.func.isRequired,
  isDirty: PropTypes.bool,
};
GenericTextInput.defaultProps = {
  isDirty: false,
};
