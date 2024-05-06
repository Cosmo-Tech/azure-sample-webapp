// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { CircularProgress, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Api } from '../services/config/Api';
import { INGESTION_STATUS } from '../services/config/ApiConstants';
import { dispatchSetApplicationErrorMessage } from '../state/dispatchers/app/ApplicationDispatcher';
import { useFindDatasetById } from '../state/hooks/DatasetHooks';
import { useOrganizationId } from '../state/hooks/OrganizationHooks';

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
  // - a list when the dynamic values have been retrieved sucessfully, these values will be shown in the dropdown list
  // - a string when an error occured, this string should be the error message to display
  const [dynamicValues, setDynamicValues] = useState(null);

  useEffect(() => {
    if (isUnmounted.current) return;
    const dynamicSourceConfig = parameter.options?.dynamicEnumValues;

    const fetchDynamicValues = async () => {
      if (!dynamicSourceConfig) return;
      if (targetDatasetId == null) {
        console.error(`No dataset id forwarded to the enum parameter, can't fetch enum values dynamically.`);
        return;
      }

      const targetDataset = findDatasetById(targetDatasetId);
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
        <Grid container direction="row" alignItems="stretch">
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
