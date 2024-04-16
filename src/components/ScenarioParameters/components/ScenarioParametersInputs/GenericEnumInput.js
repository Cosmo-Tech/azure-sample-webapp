// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { CircularProgress, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { BasicEnumInput } from '@cosmotech/ui';
import { Api } from '../../../../services/config/Api';
import { useOrganizationId } from '../../../../state/hooks/OrganizationHooks.js';
import { ConfigUtils, TranslationUtils } from '../../../../utils';

const useStyles = makeStyles((theme) => ({
  error: {
    color: theme.palette.error.main,
  },
}));

export const GenericEnumInput = ({
  parameterData,
  context,
  parameterValue,
  setParameterValue,
  isDirty,
  gridItemProps,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const organizationId = useOrganizationId();
  const isUnmounted = useRef(false);
  useEffect(() => () => (isUnmounted.current = true), []);

  const textFieldProps = {
    disabled: !context.editMode,
    id: `enum-input-${parameterData.id}`,
  };

  // Possible value types for dynamicEnumValues:
  // - 'undefined' when dynamic values are not enabled in the parameter configuration
  // - 'null' when fetching data, a placeholder with a spinner will be displayed instead of the dropdown list
  // - a list when the dynamic values have been retrieved sucessfully, these values will be shown in the dropdown list
  // - a string when an error occured, this string should be the error message to display
  const [dynamicEnumValues, setDynamicEnumValues] = useState(null);

  useEffect(() => {
    if (isUnmounted.current) return;
    const dynamicSourceConfig = parameterData.options?.dynamicEnumValues;

    const fetchDynamicEnumValues = async () => {
      if (!dynamicSourceConfig) return;
      if (context.targetDatasetId == null) {
        console.error(`No dataset id forwarded to the enum parameter, can't fetch enum values dynamically.`);
        return;
      }

      const query = { query: dynamicSourceConfig.query };
      let data;
      try {
        data = await Api.Datasets.twingraphQuery(organizationId, context.targetDatasetId, query);
      } catch (error) {
        console.warn(`An error occurred when loading dynamic enum values of parameter "${parameterData.id}"`);
        console.error(error);
        if (!isUnmounted.current)
          setDynamicEnumValues(
            t(
              'genericcomponent.enumInput.fetchingDynamicValuesError',
              'Impossible to retrieve dynamic values from data source.'
            )
          );
        return;
      }

      const newDynamicEnumValues = data.data.map((item) => ({
        key: item[dynamicSourceConfig.resultKey],
        value: item[dynamicSourceConfig.resultKey],
      }));
      if (!isUnmounted.current) setDynamicEnumValues(newDynamicEnumValues);
    };

    setDynamicEnumValues(dynamicSourceConfig === undefined ? undefined : null);
    fetchDynamicEnumValues();
    // Only re-run this effect when the target dataset (e.g. parent dataset for sub-dataset creation), hence the
    // disabled eslint warnings for missing hook dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.targetDatasetId]);

  const enumValues = useMemo(() => {
    if (Array.isArray(dynamicEnumValues)) return dynamicEnumValues;

    const rawEnumValues = ConfigUtils.getParameterAttribute(parameterData, 'enumValues') ?? [];
    if (rawEnumValues.length === 0 && parameterData.options?.dynamicEnumValues == null) {
      console.warn(
        `Enum values are not defined for scenario parameter "${parameterData.id}".\n` +
          'Please either provide an array in the "options.enumValues" field, or use "options.dynamicEnumValues" for ' +
          'this parameter in the parameters configuration file.'
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
  }, [t, parameterData, dynamicEnumValues]);

  useEffect(() => {
    if (parameterValue == null && enumValues.length > 0) {
      setParameterValue(enumValues?.[0]?.key);
    }
  }, [enumValues, parameterValue, setParameterValue]);

  const loadingValuesPlaceholder = useMemo(
    () => (
      <>
        <CircularProgress data-cy="fetching-dynamic-values-spinner" size="1rem" color="inherit" />
        <Typography sx={{ px: 2 }}>
          {t('genericcomponent.enumInput.fetchingDynamicValues', 'Fetching list of values...')}
        </Typography>
      </>
    ),
    [t]
  );

  const errorMessage = useMemo(
    () =>
      typeof dynamicEnumValues === 'string' || dynamicEnumValues instanceof String ? (
        <Typography sx={{ px: 2 }} className={classes.error}>
          {dynamicEnumValues}
        </Typography>
      ) : null,
    [dynamicEnumValues, classes.error]
  );

  return (
    errorMessage ?? (
      <Grid item xs={3} {...gridItemProps}>
        <Grid container direction="row" alignItems="stretch">
          {dynamicEnumValues === null ? (
            loadingValuesPlaceholder
          ) : (
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
          )}
        </Grid>
      </Grid>
    )
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
