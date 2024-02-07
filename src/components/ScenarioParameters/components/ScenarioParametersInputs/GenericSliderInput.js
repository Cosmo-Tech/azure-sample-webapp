// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import { BasicSliderInput } from '@cosmotech/ui';
import { TranslationUtils } from '../../../../utils';

const DEFAULT_MIN_VALUE = 0;
const DEFAULT_MAX_VALUE = 100;
const getMinValue = (parameterData) => parameterData.minValue ?? DEFAULT_MIN_VALUE;
const getMaxValue = (parameterData) => parameterData.maxValue ?? DEFAULT_MAX_VALUE;

export const GenericSliderInput = ({ parameterData, context, parameterValue, setParameterValue, isDirty }) => {
  const min = getMinValue(parameterData);
  const max = getMaxValue(parameterData);
  const { t } = useTranslation();

  return (
    <Grid item xs={3}>
      <BasicSliderInput
        key={parameterData.id}
        id={parameterData.id}
        label={t(TranslationUtils.getParameterTranslationKey(parameterData.id), parameterData.id)}
        tooltipText={t(TranslationUtils.getParameterTooltipTranslationKey(parameterData.id), '')}
        value={parameterValue}
        handleSliderValueChange={setParameterValue}
        disabled={!context.editMode}
        min={min}
        max={max}
        isDirty={isDirty}
      />
    </Grid>
  );
};
GenericSliderInput.propTypes = {
  parameterData: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  parameterValue: PropTypes.any,
  setParameterValue: PropTypes.func.isRequired,
  isDirty: PropTypes.bool,
};
GenericSliderInput.defaultProps = {
  isDirty: false,
};
