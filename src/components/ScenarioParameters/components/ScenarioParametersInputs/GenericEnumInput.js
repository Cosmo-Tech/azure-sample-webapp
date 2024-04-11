// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import { BasicEnumInput } from '@cosmotech/ui';
import { ConfigUtils, TranslationUtils } from '../../../../utils';

export const GenericEnumInput = ({
  parameterData,
  context,
  parameterValue,
  setParameterValue,
  isDirty,
  gridItemProps,
}) => {
  const { t } = useTranslation();
  const textFieldProps = {
    disabled: !context.editMode,
    id: `enum-input-${parameterData.id}`,
  };

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
      const tooltipTranslationKey = TranslationUtils.getParameterEnumValueTooltipTranslationKey(
        parameterData.id,
        enumValue.key
      );
      enumValue.value = t(valueTranslationKey, enumValue.value);
      enumValue.tooltip = t(tooltipTranslationKey, '');
      delete enumValue.tooltipText;
    }

    return rawEnumValues;
  }, [t, parameterData]);

  return (
    <Grid item xs={3} {...gridItemProps}>
      <BasicEnumInput
        key={parameterData.id}
        id={parameterData.id}
        label={t(TranslationUtils.getParameterTranslationKey(parameterData.id), parameterData.id)}
        tooltipText={t(TranslationUtils.getParameterTooltipTranslationKey(parameterData.id), '')}
        value={parameterValue ?? enumValues?.[0]?.key ?? ''}
        changeEnumField={setParameterValue}
        textFieldProps={textFieldProps}
        enumValues={enumValues}
        isDirty={isDirty}
      />
    </Grid>
  );
};

GenericEnumInput.propTypes = {
  parameterData: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  parameterValue: PropTypes.any,
  setParameterValue: PropTypes.func.isRequired,
  isDirty: PropTypes.bool,
  gridItemProps: PropTypes.object,
};
GenericEnumInput.defaultProps = {
  isDirty: false,
};
