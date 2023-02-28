// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { BasicToggleInput } from '@cosmotech/ui';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { TranslationUtils } from '../../../../utils';

export const GenericToggleInput = ({ parameterData, context, parameterValue, setParameterValue }) => {
  const { t } = useTranslation();
  const switchFieldProps = {
    disabled: !context.editMode,
    id: `toggle-input-${parameterData.id}`,
  };

  return (
    <BasicToggleInput
      key={parameterData.id}
      id={parameterData.id}
      label={t(`solution.parameters.${parameterData.id}`, parameterData.id)}
      tooltipText={t(TranslationUtils.getParameterTooltipTranslationKey(parameterData.id), '')}
      value={parameterValue ?? false}
      changeSwitchType={setParameterValue}
      switchProps={switchFieldProps}
    />
  );
};

GenericToggleInput.propTypes = {
  parameterData: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  parameterValue: PropTypes.any,
  setParameterValue: PropTypes.func.isRequired,
};
