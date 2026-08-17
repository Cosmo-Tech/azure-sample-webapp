// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Grid, Stack, Typography } from '@mui/material';
import rfdc from 'rfdc';
import { BasicEnumInput } from '@cosmotech/ui';
import { ScenarioParameterInput } from '../../../../../../components';
import { ScenarioResetValuesContext } from '../../../../../../components/ScenarioParameters/ScenarioParametersContext';
import { FILE_DATASET_PART_ID_VARTYPE } from '../../../../../../services/config/ApiConstants';
import { ScenarioParametersUtils, SolutionsUtils } from '../../../../../../utils';
import {
  PARAMETER_CONTEXT_VIEWS,
  PARAMETER_CONTEXT_WIDTH,
} from '../../../../../../utils/scenarioParameters/ParameterContext';
import { useDatasetCreationParameters } from './DatasetCreationParametersHook';

const clone = rfdc();

export const DatasetCreationParameters = ({ dataSourceRunTemplates, dialog, parentDataset, selectedRunner = {} }) => {
  const { t } = useTranslation();
  const { getValues, resetField } = useFormContext();

  const { datasourceParameterHelpers, getDataSourceTypeEnumValues, isDarkTheme } = useDatasetCreationParameters();

  const isSubDatasetCreationWizard = useMemo(() => parentDataset != null, [parentDataset]);
  const isDatasetParametersEditionDialog = selectedRunner && Object.keys(selectedRunner).length > 0;
  const [dataSourceType, setDataSourceType] = useState(selectedRunner?.runTemplateId ?? null);
  const dataSourceTypeEnumValues = useMemo(
    () => getDataSourceTypeEnumValues(dataSourceRunTemplates),
    [getDataSourceTypeEnumValues, dataSourceRunTemplates]
  );
  const defaultDataSourceTypeKey = useMemo(() => dataSourceTypeEnumValues?.[0]?.key ?? '', [dataSourceTypeEnumValues]);
  const selectedRunnerDataSourceLabel = useMemo(() => {
    return dataSourceTypeEnumValues?.find((rt) => rt.key === dataSourceType)?.value || dataSourceType;
  }, [dataSourceTypeEnumValues, dataSourceType]);

  useEffect(() => {
    if (dataSourceType == null) setDataSourceType(defaultDataSourceTypeKey);
  }, [dataSourceType, setDataSourceType, defaultDataSourceTypeKey]);

  useEffect(() => {
    if (!dialog?.setWidth) return;
    const runTemplate = dataSourceRunTemplates[dataSourceType];
    if (
      (runTemplate?.parameters ?? []).some(
        (parameter) =>
          parameter?.varType === FILE_DATASET_PART_ID_VARTYPE && parameter?.additionalData?.subType === 'TABLE'
      )
    )
      dialog.setWidth(PARAMETER_CONTEXT_WIDTH.LARGE);
    else dialog.setWidth(PARAMETER_CONTEXT_WIDTH.SMALL);
  }, [dataSourceRunTemplates, dataSourceType, dialog]);

  const defaultFormState = useRef({});
  const { sourceParameters, scenarioResetValues } = useMemo(() => {
    const resetValues = {};
    const forgeParameterInput = (originalParameter) => {
      const parameterId = originalParameter.id;
      const datasourcePatch = datasourceParameterHelpers?.find((datasource) => datasource.id === dataSourceType);
      const parametersPatch = datasourcePatch?.parameters?.find((el) => el.id === parameterId);
      const parameter = clone(originalParameter);

      if (parametersPatch) {
        parameter.defaultValue = parametersPatch.defaultValue;
        parameter.additionalData = parameter.additionalData ?? {};
        parameter.additionalData.tooltipText = parametersPatch.tooltipText;
      }
      const defaultValue = ScenarioParametersUtils.getDefaultParametersValues([parameterId], [parameter])[parameterId];
      const escapedSourceType = SolutionsUtils.escapeRunTemplateId(dataSourceType);
      const fieldPath = `${escapedSourceType}.${parameterId}`;
      defaultFormState.current[fieldPath] = defaultValue;
      resetValues[fieldPath] = defaultValue;

      return (
        <ScenarioParameterInput
          key={fieldPath}
          parameterData={parameter}
          context={{
            isDarkTheme,
            editMode: true,
            targetDataset: parentDataset,
            fieldName: fieldPath,
            view: PARAMETER_CONTEXT_VIEWS.DATASET_MANAGER,
            width: dialog?.width ?? PARAMETER_CONTEXT_WIDTH.SMALL,
            defaultValue,
          }}
          defaultParameterValue={defaultValue}
        />
      );
    };

    const runTemplate = dataSourceRunTemplates[dataSourceType];
    defaultFormState.current = {};
    const parameters = runTemplate?.parameters?.map((parameter) => forgeParameterInput(parameter));
    return { sourceParameters: parameters, scenarioResetValues: resetValues };
  }, [dataSourceRunTemplates, dataSourceType, datasourceParameterHelpers, dialog?.width, isDarkTheme, parentDataset]);

  useEffect(() => {
    // Do not reset form when updating an existing dataset (already done in a useEffect in UpdateDatasetDialog)
    if (isDatasetParametersEditionDialog) return;

    const formValues = getValues();
    for (const [sourceType, parameters] of Object.entries(formValues)) {
      // Ignore fields that are not source types
      if (['name', 'tags', 'description', 'sourceType'].includes(sourceType)) continue;
      for (const [parameterId, parameterValue] of Object.entries(parameters)) {
        const escapedSourceType = SolutionsUtils.escapeRunTemplateId(sourceType);
        const fieldPath = `${escapedSourceType}.${parameterId}`;
        defaultFormState.current[fieldPath] = parameterValue;
      }
    }
    for (const [key, defaultValue] of Object.entries(defaultFormState.current)) {
      resetField(key, { defaultValue });
    }
  }, [getValues, isDatasetParametersEditionDialog, resetField, sourceParameters]);

  const labels = useMemo(() => {
    return isSubDatasetCreationWizard
      ? {
          subtitle: t(
            'commoncomponents.datasetmanager.wizard.secondScreen.subdatasetSubtitle',
            'Please select a filter'
          ),
          sourceSelectLabel: t(
            'commoncomponents.datasetmanager.wizard.secondScreen.dataSourceType.subdatasetLabel',
            'Filter'
          ),
        }
      : {
          subtitle: t(
            'commoncomponents.datasetmanager.wizard.secondScreen.subtitle',
            'Please provide your data source'
          ),
          sourceSelectLabel: t('commoncomponents.datasetmanager.wizard.secondScreen.dataSourceType.label', 'Source'),
        };
  }, [t, isSubDatasetCreationWizard]);

  const sourceTypeComponent = isDatasetParametersEditionDialog ? (
    <Typography data-cy="selected-runner-source-type">
      {labels.sourceSelectLabel + ': ' + selectedRunnerDataSourceLabel}
    </Typography>
  ) : (
    <Grid sx={{ py: 1 }} size={7}>
      <Controller
        name="sourceType"
        key="sourceType"
        defaultValue={dataSourceType ?? defaultDataSourceTypeKey}
        shouldUnregister
        render={({ field }) => {
          const { value, onChange } = field;
          const setDatasetSource = (newValue) => {
            onChange(newValue);
            setDataSourceType(newValue);
          };

          return (
            <BasicEnumInput
              id="new-dataset-sourceType"
              label={labels.sourceSelectLabel}
              size="medium"
              value={value ?? defaultDataSourceTypeKey}
              changeEnumField={setDatasetSource}
              enumValues={dataSourceTypeEnumValues}
            />
          );
        }}
      />
    </Grid>
  );

  return (
    <Grid container direction="column" sx={{ width: '100%' }}>
      {!isDatasetParametersEditionDialog && (
        <Grid sx={{ py: 2 }}>{<Typography sx={{ py: 2 }}>{labels.subtitle}</Typography>}</Grid>
      )}
      <Grid size={{ xs: 7 }} sx={{ width: '100%' }}>
        {sourceTypeComponent}
      </Grid>

      <Grid size={12}>
        <ScenarioResetValuesContext.Provider value={scenarioResetValues}>
          <Stack
            spacing={dialog?.width === PARAMETER_CONTEXT_WIDTH.LARGE ? 2 : 1}
            direction="column"
            sx={{ alignItems: 'stretch', justifyContent: 'center', px: 2, pt: 3, width: '100%' }}
          >
            {sourceParameters}
          </Stack>
        </ScenarioResetValuesContext.Provider>
      </Grid>
    </Grid>
  );
};

DatasetCreationParameters.propTypes = {
  dataSourceRunTemplates: PropTypes.object.isRequired,
  dialog: PropTypes.shape({
    width: PropTypes.string.isRequired,
    setWidth: PropTypes.func.isRequired,
  }),
  parentDataset: PropTypes.object,
  selectedRunner: PropTypes.object,
};
