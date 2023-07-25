// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { BasicToggleInput } from '@cosmotech/ui';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { TranslationUtils } from '../../../../utils';
import { useParameterConstraintValidation } from '../../../../hooks/ParameterConstraintsHooks';

export const GenericToggleInput = ({ parameterData, context, parameterValue, setParameterValue, isDirty, error }) => {
  const { t } = useTranslation();
  const switchFieldProps = {
    disabled: !context.editMode,
    id: `toggle-input-${parameterData.id}`,
  };

  return (
    <BasicToggleInput
      key={parameterData.id}
      id={parameterData.id}
      label={t(TranslationUtils.getParameterTranslationKey(parameterData.id), parameterData.id)}
      tooltipText={t(TranslationUtils.getParameterTooltipTranslationKey(parameterData.id), '')}
      value={parameterValue ?? false}
      changeSwitchType={setParameterValue}
      switchProps={switchFieldProps}
      isDirty={isDirty}
      error={error}
    />
  );
};

GenericToggleInput.propTypes = {
  parameterData: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  parameterValue: PropTypes.any,
  setParameterValue: PropTypes.func.isRequired,
  isDirty: PropTypes.bool,
  error: PropTypes.object,
};
GenericToggleInput.defaultProps = {
  isDirty: false,
};
GenericToggleInput.useValidationRules = (parameterData) => {
  const { getParameterConstraintValidation } = useParameterConstraintValidation(parameterData);
  return {
    validate: {
      constraint: (v) => getParameterConstraintValidation(v),
    },
  };
};
