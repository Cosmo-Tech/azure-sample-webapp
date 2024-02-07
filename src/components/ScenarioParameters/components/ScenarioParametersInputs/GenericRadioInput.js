// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import { BasicRadioInput } from '@cosmotech/ui';
import { TranslationUtils, ConfigUtils } from '../../../../utils';

export const GenericRadioInput = ({ parameterData, context, parameterValue, setParameterValue, isDirty }) => {
  const { t } = useTranslation();
  const enumValues = useMemo(() => {
    const rawEnumValues = ConfigUtils.getParameterAttribute(parameterData, 'enumValues') ?? [];
    if (rawEnumValues.length === 0) {
      console.warn(
        `Enum values are not defined for scenario parameter "${parameterData.id}".\n` +
          'Please provide an array in the "options.enumValues" field for this parameter in the parameters ' +
          'configuration file.'
      );
    }

    for (const enumValue of rawEnumValues) {
      const valueTranslationKey = TranslationUtils.getParameterEnumValueTranslationKey(parameterData.id, enumValue.key);
      enumValue.value = t(valueTranslationKey, enumValue.value);
    }

    return rawEnumValues;
  }, [t, parameterData]);

  const textFieldProps = {
    disabled: !context.editMode,
    id: parameterData.id,
  };

  return (
    <Grid item xs={3}>
      <BasicRadioInput
        key={parameterData.id}
        id={parameterData.id}
        label={t(TranslationUtils.getParameterTranslationKey(parameterData.id), parameterData.id)}
        value={parameterValue ?? enumValues?.[0]?.key ?? ''}
        tooltipText={t(TranslationUtils.getParameterTooltipTranslationKey(parameterData.id), '')}
        changeRadioOption={setParameterValue}
        textFieldProps={textFieldProps}
        enumValues={enumValues}
        isDirty={isDirty}
      />
    </Grid>
  );
};
GenericRadioInput.propTypes = {
  parameterData: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  parameterValue: PropTypes.any,
  setParameterValue: PropTypes.func.isRequired,
  isDirty: PropTypes.bool,
};
GenericRadioInput.defaultProps = {
  isDirty: false,
};
