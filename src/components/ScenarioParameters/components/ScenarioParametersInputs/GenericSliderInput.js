// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import { BasicSliderInput } from '@cosmotech/ui';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { TranslationUtils } from '../../../../utils';

const DEFAULT_MIN_VALUE = 0;
const DEFAULT_MAX_VALUE = 100;
const getMinValue = (parameterData) => parameterData.minValue ?? DEFAULT_MIN_VALUE;
const getMaxValue = (parameterData) => parameterData.maxValue ?? DEFAULT_MAX_VALUE;

export const GenericSliderInput = ({ parameterData, context, parameterValue, setParameterValue }) => {
  const min = getMinValue(parameterData);
  const max = getMaxValue(parameterData);
  const { t } = useTranslation();

  return (
    <BasicSliderInput
      key={parameterData.id}
      id={parameterData.id}
      label={t(`solution.parameters.${parameterData.id}`, parameterData.id)}
      tooltipText={t(TranslationUtils.getParameterTooltipTranslationKey(parameterData.id), '')}
      value={parameterValue}
      handleSliderValueChange={setParameterValue}
      disabled={!context.editMode}
      min={min}
      max={max}
    />
  );
};
GenericSliderInput.propTypes = {
  parameterData: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  parameterValue: PropTypes.any,
  setParameterValue: PropTypes.func.isRequired,
};
