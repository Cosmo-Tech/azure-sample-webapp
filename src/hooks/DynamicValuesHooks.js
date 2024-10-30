// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { CircularProgress, Grid2 as Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Api } from '../services/config/Api';
import { INGESTION_STATUS } from '../services/config/ApiConstants';
import { dispatchSetApplicationErrorMessage } from '../state/dispatchers/app/ApplicationDispatcher';
import { useFindDatasetById } from '../state/hooks/DatasetHooks';
import { useOrganizationId } from '../state/hooks/OrganizationHooks';
import { useCurrentSimulationRunnerParametersValues } from '../state/hooks/RunnerHooks';
import { GENERIC_VAR_TYPES_DEFAULT_VALUES } from '../utils/scenarioParameters/generic/DefaultValues';

const useStyles = makeStyles((theme) => ({
  error: {
    color: theme.palette.error.main,
  },
}));

export const useDynamicValues = (parameter, targetDatasetId) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const findDatasetById = useFindDatasetById();
  const organizationId = useOrganizationId();

  const isUnmounted = useRef(false);
  useEffect(() => () => (isUnmounted.current = true), []);

  // Possible value types for dynamicValues:
  // - 'undefined' when dynamic values are not enabled in the parameter configuration
  // - 'null' when fetching data, a placeholder with a spinner will be displayed instead of the dropdown list
  // - a list when the dynamic values have been retrieved successfully, these values will be shown in the dropdown list
  // - a string when an error occurred, this string should be the error message to display
  const [dynamicValues, setDynamicValues] = useState(null);

  useEffect(() => {
    if (isUnmounted.current) return;
    const dynamicSourceConfig = parameter.options?.dynamicEnumValues;

    const fetchDynamicValues = async () => {
      if (!dynamicSourceConfig) return;
      if (targetDatasetId == null) {
        setDynamicValues(
          t(
            'genericcomponent.dynamicValues.noDataset',
            "No dataset id forwarded to the parameter, can't fetch its value dynamically."
          )
        );
        return;
      }

      const targetDataset = findDatasetById(targetDatasetId);
      if (!targetDataset) {
        setDynamicValues(
          t(
            'genericcomponent.dynamicValues.notExistingDataset',
            "Can't retrieve dynamic values: dataset doesn't exist."
          )
        );
        return;
      }
      if (!isUnmounted.current && targetDataset.ingestionStatus !== INGESTION_STATUS.SUCCESS) {
        setDynamicValues(
          `Can't retrieve dynamic values: dataset is not ready (ingestionStatus is "${targetDataset.ingestionStatus}")`
        );
        return;
      }

      const query = { query: dynamicSourceConfig.query };
      let data;
      try {
        data = await Api.Datasets.twingraphQuery(organizationId, targetDatasetId, query);
        const resultKey = dynamicSourceConfig.resultKey;
        const newDynamicValues = data.data.map((item) => ({ key: item[resultKey], value: item[resultKey] }));
        if (newDynamicValues.length > 0 && newDynamicValues[0].key === undefined)
          throw new Error(
            `No property found with result key "${resultKey}" in response to dynamic values query. ` +
              'Please check your dataset and your solution configuration.'
          );

        if (!isUnmounted.current) setDynamicValues(newDynamicValues);
      } catch (error) {
        console.warn(`An error occurred when loading dynamic enum values of parameter "${parameter.id}"`);
        console.error(error);
        const errorTitle = t(
          'genericcomponent.enumInput.fetchingDynamicValuesError',
          'Impossible to retrieve dynamic values from data source'
        );
        dispatch(dispatchSetApplicationErrorMessage(error, errorTitle));
        if (!isUnmounted.current) setDynamicValues(errorTitle);
      }
    };

    setDynamicValues(dynamicSourceConfig === undefined ? undefined : null);
    fetchDynamicValues();
    // Only re-run this effect when the target dataset (e.g. parent dataset for sub-dataset creation), hence the
    // disabled eslint warnings for missing hook dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDatasetId]);

  const dynamicValuesError = useMemo(
    () =>
      typeof dynamicValues === 'string' ? (
        <Typography sx={{ px: 2 }} className={classes.error}>
          {dynamicValues}
        </Typography>
      ) : null,
    [dynamicValues, classes.error]
  );

  const loadingDynamicValuesPlaceholder = useMemo(
    () =>
      dynamicValues === null ? (
        <Grid container direction="row" sx={{ alignItems: 'stretch' }}>
          <CircularProgress data-cy="fetching-dynamic-values-spinner" size="1rem" color="inherit" />
          <Typography sx={{ px: 2 }}>
            {t('genericcomponent.enumInput.fetchingDynamicValues', 'Fetching list of values...')}
          </Typography>
        </Grid>
      ) : null,
    [t, dynamicValues]
  );

  return {
    dynamicValues,
    setDynamicValues, // Not strictly necessary, but could be useful to reset dynamic values
    dynamicValuesError,
    loadingDynamicValuesPlaceholder,
  };
};

export const useLoadInitialValueFromDataset = (parameterValue, parameter, targetDatasetId) => {
  const { t } = useTranslation();
  const findDatasetById = useFindDatasetById();
  const organizationId = useOrganizationId();
  const parametersValues = useCurrentSimulationRunnerParametersValues();

  const isUnmounted = useRef(false);
  useEffect(() => () => (isUnmounted.current = true), []);

  // Possible value types for dynamicValue:
  // - 'undefined' when dynamic values are not enabled in the parameter configuration
  // - 'null' when fetching data, a placeholder with a spinner will be displayed instead of the input
  // - a value when the query is successful, it will be displayed in the input
  const [dynamicValue, setDynamicValue] = useState(undefined);
  const [dynamicValueError, setDynamicValueError] = useState(null);
  const targetDataset = findDatasetById(targetDatasetId);
  const defaultValue = parameter?.defaultValue ?? GENERIC_VAR_TYPES_DEFAULT_VALUES[parameter?.varType];
  const dynamicSourceConfig = parameter.options?.dynamicValues;
  const resultKey = dynamicSourceConfig?.resultKey;

  useEffect(() => {
    if (isUnmounted.current) return;
    const scenarioParameterValue =
      parametersValues?.find((scenarioParameter) => scenarioParameter.parameterId === parameter.id) ?? null;
    if (scenarioParameterValue !== null) {
      setDynamicValueError(null);
    }

    const fetchDynamicValue = async () => {
      if (parameterValue !== null) {
        setDynamicValue(undefined);
        return;
      }

      if (targetDatasetId == null) {
        setDynamicValue(defaultValue);
        setDynamicValueError('noDataset');
        return;
      }

      if (!targetDataset) {
        setDynamicValue(defaultValue);
        setDynamicValueError('notExistingDataset');
        return;
      }
      if (targetDataset?.ingestionStatus === null) {
        setDynamicValue(defaultValue);
        setDynamicValueError('notTwingraph');
        return;
      }
      if (targetDataset?.ingestionStatus !== INGESTION_STATUS.SUCCESS) {
        setDynamicValue(defaultValue);
        setDynamicValueError('ingestionStatusError');
        return;
      }

      const query = { query: dynamicSourceConfig.query };
      let data;
      try {
        data = await Api.Datasets.twingraphQuery(organizationId, targetDatasetId, query);
        const resultKey = dynamicSourceConfig.resultKey;
        const newDynamicValue = data.data[0]?.[resultKey];
        if (newDynamicValue === undefined) {
          setDynamicValue(defaultValue);
          setDynamicValueError('resultKeyError');
          return;
        }
        if (!isUnmounted.current) setDynamicValue(newDynamicValue);
      } catch (error) {
        console.warn(`An error occurred when loading dynamic value of parameter "${parameter.id}"`);
        console.error(error);
        setDynamicValue(defaultValue);
        setDynamicValueError('queryError');
      }
    };
    if (dynamicSourceConfig) {
      setDynamicValue(null);
      fetchDynamicValue();
    }
    // Re-run this effect when
    // 1. the target dataset (e.g. parent dataset for sub-dataset creation) changes
    // 2. parameter value changes, otherwise, input doesn't receive the fetched value and displays an error
    // 3. when parametersValues change after save to hide error icon
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDatasetId, parameterValue, parametersValues]);

  const loadingDynamicValuePlaceholder = useMemo(
    () =>
      dynamicValue === null ? (
        <Grid container direction="row" sx={{ alignItems: 'stretch' }}>
          <CircularProgress data-cy="fetching-dynamic-parameter-spinner" size="1rem" color="inherit" />
          <Typography sx={{ px: 2 }}>
            {t('genericcomponent.numberInput.fetchingValue', 'Fetching parameter value...')}
          </Typography>
        </Grid>
      ) : null,
    [t, dynamicValue]
  );

  const dynamicValueErrorMessage = useMemo(() => {
    switch (dynamicValueError) {
      case 'noDataset':
        return (
          t(
            'genericcomponent.dynamicValues.noDataset',
            "No dataset id forwarded to the parameter, can't fetch its value dynamically."
          ) +
          ' ' +
          t('genericcomponent.dynamicValues.defaultValueDisplayed', 'Parameter default value is displayed')
        );
      case 'notExistingDataset':
        return (
          t(
            'genericcomponent.dynamicValues.notExistingDataset',
            "Can't retrieve dynamic values: dataset doesn't exist."
          ) +
          ' ' +
          t('genericcomponent.dynamicValues.defaultValueDisplayed', 'Parameter default value is displayed')
        );
      case 'notTwingraph':
        return (
          t(
            'genericcomponent.dynamicValues.notTwingraphDataset',
            "Can't retrieve dynamic values: only twingraph datasets can be used to dynamically fetch values"
          ) +
          ' ' +
          t('genericcomponent.dynamicValues.defaultValueDisplayed', 'Parameter default value is displayed')
        );
      case 'ingestionStatusError':
        return (
          t(
            'genericcomponent.dynamicValues.ingestionStatusError',
            "Can't retrieve dynamic values: dataset ingestionStatus is {{ingestionStatus}}",
            { ingestionStatus: targetDataset?.ingestionStatus }
          ) +
          ' ' +
          t('genericcomponent.dynamicValues.defaultValueDisplayed', 'Parameter default value is displayed')
        );
      case 'resultKeyError':
        return (
          t(
            'genericcomponent.dynamicValues.resultKeyError',
            'No property found with result key {{resultKey}} in response to dynamic value query. ' +
              'Please check your dataset and your solution configuration.',
            { resultKey }
          ) +
          ' ' +
          t('genericcomponent.dynamicValues.defaultValueDisplayed', 'Parameter default value is displayed')
        );
      case 'queryError':
        return (
          t('genericcomponent.dynamicValues.queryError', 'Impossible to retrieve dynamic values from data source') +
          ' ' +
          t('genericcomponent.dynamicValues.defaultValueDisplayed', 'Parameter default value is displayed')
        );
      default:
        return null;
    }
  }, [dynamicValueError, resultKey, t, targetDataset?.ingestionStatus]);

  return {
    dynamicValue,
    setDynamicValue, // Not strictly necessary, but could be useful to reset dynamic values
    loadingDynamicValuePlaceholder,
    dynamicValueErrorMessage,
  };
};
