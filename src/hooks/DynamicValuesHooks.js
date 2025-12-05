// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { CircularProgress, Grid, Typography } from '@mui/material';
import { useGetDatasetRunnerStatus } from '../hooks/DatasetRunnerHooks';
import { RUNNER_RUN_STATE } from '../services/config/ApiConstants';
import DatasetService from '../services/dataset/DatasetService';
import { setApplicationErrorMessage } from '../state/app/reducers';
import { useCurrentSimulationRunnerParametersValues } from '../state/runner/hooks';
import { ConfigUtils, DatasetsUtils } from '../utils';
import { getColumnFirstValue, parseCSVFromAPIResponse } from '../utils/DatasetQueryUtils';
import { GENERIC_VAR_TYPES_DEFAULT_VALUES } from '../utils/scenarioParameters/generic/DefaultValues';

export const useDynamicValues = (parameter, targetDataset) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const getDatasetRunnerStatus = useGetDatasetRunnerStatus();

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
    const dynamicSourceConfig = ConfigUtils.getParameterAttribute(parameter, 'dynamicEnumValues');

    const fetchDynamicValues = async () => {
      if (!dynamicSourceConfig) return;
      if (targetDataset.id == null) {
        setDynamicValues(
          t(
            'genericcomponent.dynamicValues.noDataset',
            "No dataset id forwarded to the parameter, can't fetch its value dynamically."
          )
        );
        return;
      }

      if (!targetDataset) {
        setDynamicValues(
          t(
            'genericcomponent.dynamicValues.notExistingDataset',
            "Can't retrieve dynamic values: dataset doesn't exist."
          )
        );
        return;
      }

      const datasetRunnerStatus = getDatasetRunnerStatus(targetDataset);
      if (!isUnmounted.current && datasetRunnerStatus !== RUNNER_RUN_STATE.SUCCESSFUL) {
        setDynamicValues(
          `Can't retrieve dynamic values: dataset is not ready (its runner status is "${datasetRunnerStatus}")`
        );
        return;
      }

      const { datasetPartName, options: queryOptions, resultKey } = dynamicSourceConfig;
      if (!datasetPartName) {
        setDynamicValues(
          t(
            'genericcomponent.dynamicValues.missingDatasetPartName',
            'Missing attribute "datasetPartName" in dynamic values configuration.'
          )
        );
        return;
      }
      const datasetPart = (targetDataset?.parts ?? []).find((part) => part.name === datasetPartName);
      if (!datasetPart) {
        setDynamicValues(
          t(
            'genericcomponent.dynamicValues.datasetPartNotFound',
            'No dataset part found in dataset with the provided datasetPartName.'
          )
        );
        return;
      }

      let data;
      try {
        data = await DatasetService.queryDatasetPart(datasetPart, queryOptions);
        const { rows } = parseCSVFromAPIResponse(data);
        const newDynamicValues = rows.map((item) => ({ key: item[resultKey], value: item[resultKey] }));
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
        dispatch(setApplicationErrorMessage({ error, errorMessage: errorTitle }));
        if (!isUnmounted.current) setDynamicValues(errorTitle);
      }
    };

    setDynamicValues(dynamicSourceConfig === undefined ? undefined : null);
    fetchDynamicValues();
    // Only re-run this effect when the target dataset (e.g. parent dataset for sub-dataset creation), hence the
    // disabled eslint warnings for missing hook dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDataset.id]);

  const dynamicValuesError = useMemo(
    () =>
      typeof dynamicValues === 'string' ? (
        <Typography sx={{ px: 2, color: (theme) => theme.palette.error.main }}>{dynamicValues}</Typography>
      ) : null,
    [dynamicValues]
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

const getDynamicValueErrorMessage = (t, errorKey, options) => {
  const errorMessageMap = {
    noDataset: {
      key: 'genericcomponent.dynamicValues.noDataset',
      fallback: "No dataset id forwarded to the parameter, can't fetch its value dynamically.",
    },
    notExistingDataset: {
      key: 'genericcomponent.dynamicValues.notExistingDataset',
      fallback: "Can't retrieve dynamic values: dataset doesn't exist.",
    },
    noDBDatasetParts: {
      key: 'genericcomponent.dynamicValues.noDBDatasetParts',
      fallback: 'Only datasets with parts of type "DB" can be used to dynamically fetch values.',
    },
    runnerStatusError: {
      key: 'genericcomponent.dynamicValues.runnerStatusError',
      fallback: "Can't retrieve dynamic values: dataset runner status is {{runnerStatus}}",
    },
    resultKeyError: {
      key: 'genericcomponent.dynamicValues.resultKeyError',
      fallback:
        'No property found with result key {{resultKey}} in response to dynamic value query. ' +
        'Please check your dataset and your solution configuration.',
    },
    queryError: {
      key: 'genericcomponent.dynamicValues.queryError',
      fallback: 'Impossible to retrieve dynamic values from data source',
    },
    missingDatasetPartName: {
      key: 'genericcomponent.dynamicValues.missingDatasetPartName',
      fallback: 'Missing attribute "datasetPartName" in dynamic values configuration.',
    },
    datasetPartNotFound: {
      key: 'genericcomponent.dynamicValues.datasetPartNotFound',
      fallback: 'No dataset part found in dataset with the provided datasetPartName.',
    },
  };

  const errorMessageEntry = errorMessageMap[errorKey];
  if (errorMessageEntry == null) return null;

  const defaultValueWarning = t(
    'genericcomponent.dynamicValues.defaultValueDisplayed',
    'Parameter default value is displayed'
  );
  const errorMessage = t(errorMessageEntry.key, errorMessageEntry.fallback, options);
  return `${errorMessage} ${defaultValueWarning}`;
};

export const useLoadInitialValueFromDataset = (parameterValue, parameter, targetDataset) => {
  const { t } = useTranslation();
  const getDatasetRunnerStatus = useGetDatasetRunnerStatus();
  const parametersValues = useCurrentSimulationRunnerParametersValues();

  const isUnmounted = useRef(false);
  useEffect(() => () => (isUnmounted.current = true), []);

  // Possible value types for dynamicValue:
  // - 'undefined' when dynamic values are not enabled in the parameter configuration
  // - 'null' when fetching data, a placeholder with a spinner will be displayed instead of the input
  // - a value when the query is successful, it will be displayed in the input
  const [dynamicValue, setDynamicValue] = useState(undefined);
  const [dynamicValueError, setDynamicValueError] = useState(null);
  const defaultValue = parameter?.defaultValue ?? GENERIC_VAR_TYPES_DEFAULT_VALUES[parameter?.varType];
  const dynamicSourceConfig = ConfigUtils.getParameterAttribute(parameter, 'dynamicValues');
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

      if (targetDataset.id == null) {
        setDynamicValue(defaultValue);
        setDynamicValueError('noDataset');
        return;
      }

      if (!targetDataset) {
        setDynamicValue(defaultValue);
        setDynamicValueError('notExistingDataset');
        return;
      }
      if (!DatasetsUtils.hasDBDatasetParts(targetDataset)) {
        setDynamicValue(defaultValue);
        setDynamicValueError('noDBDatasetParts');
        return;
      }
      const datasetRunnerStatus = getDatasetRunnerStatus(targetDataset);
      if (datasetRunnerStatus !== RUNNER_RUN_STATE.SUCCESSFUL) {
        setDynamicValue(defaultValue);
        setDynamicValueError('runnerStatusError');
        return;
      }

      const { datasetPartName, options: queryOptions } = dynamicSourceConfig;
      if (!datasetPartName) {
        setDynamicValue(defaultValue);
        setDynamicValueError('missingDatasetPartName');
        return;
      }
      const datasetPart = (targetDataset?.parts ?? []).find((part) => part.name === datasetPartName);
      if (!datasetPart) {
        setDynamicValue(defaultValue);
        setDynamicValueError('datasetPartNotFound');
        return;
      }

      let data;
      try {
        data = await DatasetService.queryDatasetPart(datasetPart, queryOptions);
        const newDynamicValue = getColumnFirstValue(parseCSVFromAPIResponse(data), resultKey);
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
  }, [targetDataset?.id, parameterValue, parametersValues]);

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
    const options = { resultKey, runnerStatus: getDatasetRunnerStatus(targetDataset) };
    return getDynamicValueErrorMessage(t, dynamicValueError, options);
  }, [getDatasetRunnerStatus, dynamicValueError, resultKey, t, targetDataset]);

  return {
    dynamicValue,
    setDynamicValue, // Not strictly necessary, but could be useful to reset dynamic values
    loadingDynamicValuePlaceholder,
    dynamicValueErrorMessage,
  };
};
