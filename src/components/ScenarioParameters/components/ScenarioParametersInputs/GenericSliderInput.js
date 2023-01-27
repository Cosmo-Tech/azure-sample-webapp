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

export const GenericSliderInput = ({ parameterData, parametersState, setParametersState, context }) => {
  const min = getMinValue(parameterData);
  const max = getMaxValue(parameterData);
  const { t } = useTranslation();
  const setValue = (newValue) => {
    setParametersState((currentParametersState) => ({
      ...currentParametersState,
      [parameterData.id]: newValue,
    }));
  };

  return (
    <BasicSliderInput
      key={parameterData.id}
      data-cy={`slider-input-${parameterData.id}`}
      label={t(`solution.parameters.${parameterData.id}`, parameterData.id)}
      tooltipText={t(TranslationUtils.getParameterTooltipTranslationKey(parameterData.id), '')}
      value={parametersState[parameterData.id]}
      handleSliderValueChange={setValue}
      disabled={!context.editMode}
      min={min}
      max={max}
    />
  );
};
GenericSliderInput.propTypes = {
  parameterData: PropTypes.object.isRequired,
  parametersState: PropTypes.object.isRequired,
  setParametersState: PropTypes.func.isRequired,
  context: PropTypes.object.isRequired,
};
