// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Grid2 as Grid, Typography } from '@mui/material';
import rfdc from 'rfdc';
import { UploadFile, BasicEnumInput } from '@cosmotech/ui';
import {
  GenericEnumInput,
  GenericMultiSelect,
  GenericTextInput,
  GenericDateInput,
} from '../../../../../../components/ScenarioParameters/components/ScenarioParametersInputs';
import { ConfigUtils, SolutionsUtils, TranslationUtils } from '../../../../../../utils';
import { FileManagementUtils } from '../../../../../../utils/FileManagementUtils';
import { useDatasetCreationParameters } from './DatasetCreationParametersHook';

const clone = rfdc();

export const DatasetCreationParameters = ({ dataSourceRunTemplates, parentDataset }) => {
  const { t } = useTranslation();
  const { resetField } = useFormContext();
  const { datasourceParameterHelpers, getDataSourceTypeEnumValues, getUploadFileLabels, getDefaultFileTypeFilter } =
    useDatasetCreationParameters();

  const isSubDatasetCreationWizard = useMemo(() => parentDataset != null, [parentDataset]);
  const [dataSourceType, setDataSourceType] = useState(null);
  const dataSourceTypeEnumValues = useMemo(
    () => getDataSourceTypeEnumValues(dataSourceRunTemplates),
    [getDataSourceTypeEnumValues, dataSourceRunTemplates]
  );
  const defaultDataSourceTypeKey = useMemo(() => dataSourceTypeEnumValues?.[0]?.key ?? '', [dataSourceTypeEnumValues]);

  useEffect(() => {
    if (dataSourceType == null) setDataSourceType(defaultDataSourceTypeKey);
  }, [dataSourceType, setDataSourceType, defaultDataSourceTypeKey]);

  const sourceParameters = useMemo(() => {
    const forgeParameterInput = (originalParameter) => {
      const parameterId = originalParameter.id;
      const datasourcePatch = datasourceParameterHelpers?.find((datasource) => datasource.id === dataSourceType);
      const parametersPatch = datasourcePatch?.parameters?.find((el) => el.id === parameterId);
      const parameter = clone(originalParameter);

      if (parametersPatch) {
        parameter.defaultValue = parametersPatch.defaultValue;
        parameter.options = parameter.options ?? {};
        parameter.options.tooltipText = parametersPatch.tooltipText;
      }
      const escapedSourceType = SolutionsUtils.escapeRunTemplateId(dataSourceType);
      const fieldPath = `${escapedSourceType}.${parameterId}`;
      const inputType = parameter.varType;

      let defaultValue;
      if (inputType === 'string') defaultValue = parameter?.defaultValue ?? '';
      else if (inputType === 'enum') {
        const enumValues = ConfigUtils.getParameterAttribute(parameter, 'enumValues') ?? [];
        defaultValue = enumValues?.[0]?.key;
      } else if (inputType === 'list') {
        defaultValue = [];
      } else if (inputType === '%DATASETID%') {
        defaultValue = null;
      } else if (inputType === 'date') {
        defaultValue = new Date();
      } else {
        console.error(`VarType "${inputType}" is not supported for ETL runner parameters.`);
        return null;
      }

      return (
        <Controller
          key={fieldPath}
          name={fieldPath}
          defaultValue={defaultValue}
          rules={{ required: true }}
          render={({ field }) => {
            const { value, onChange } = field;
            if (inputType === 'string') {
              return (
                <GenericTextInput
                  parameterData={parameter}
                  context={{ editMode: true }}
                  parameterValue={value}
                  setParameterValue={onChange}
                  gridItemProps={{ sx: { pt: 1 }, size: 12 }}
                  size="medium"
                  isDirty={null}
                />
              );
            } else if (inputType === 'enum') {
              return (
                <GenericEnumInput
                  gridItemProps={{ size: 6, sx: { pt: 2 } }}
                  parameterData={parameter}
                  context={{ editMode: true, targetDatasetId: parentDataset?.id }}
                  parameterValue={value}
                  setParameterValue={onChange}
                  resetParameterValue={(newDefaultValue) => resetField(fieldPath, { defaultValue: newDefaultValue })}
                  isDirty={null}
                />
              );
            } else if (inputType === 'list') {
              return (
                <GenericMultiSelect
                  gridItemProps={{ sx: { pt: 2 } }}
                  parameterData={parameter}
                  context={{ editMode: true, targetDatasetId: parentDataset?.id }}
                  parameterValue={value}
                  setParameterValue={onChange}
                  isDirty={null}
                />
              );
            } else if (inputType === '%DATASETID%') {
              return (
                <Grid sx={{ pt: 1 }} size={12}>
                  <UploadFile
                    id={parameterId}
                    key={parameterId}
                    labels={getUploadFileLabels(parameterId, parameter.idForTranslationKey)}
                    tooltipText={t(TranslationUtils.getParameterTooltipTranslationKey(parameterId), '')}
                    handleUploadFile={(event) => FileManagementUtils.prepareToUpload(event, onChange)}
                    editMode={true}
                    handleDeleteFile={() => onChange(null)}
                    file={value ?? {}}
                    acceptedFileTypes={getDefaultFileTypeFilter(dataSourceRunTemplates, parameterId)}
                  />
                </Grid>
              );
            } else if (inputType === 'date') {
              return (
                <GenericDateInput
                  gridItemProps={{ sx: { pt: 1 }, size: 6 }}
                  parameterData={parameter}
                  context={{ editMode: true }}
                  parameterValue={value}
                  setParameterValue={onChange}
                  isDirty={null}
                  error={null}
                />
              );
            } else {
              return null;
            }
          }}
        />
      );
    };

    const runTemplate = dataSourceRunTemplates[dataSourceType];
    return runTemplate?.parameters?.map((parameter) => forgeParameterInput(parameter));
  }, [
    t,
    getUploadFileLabels,
    getDefaultFileTypeFilter,
    dataSourceRunTemplates,
    dataSourceType,
    parentDataset?.id,
    datasourceParameterHelpers,
    resetField,
  ]);

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

  return (
    <Grid container direction="column" sx={{ width: '100%' }}>
      <Grid sx={{ py: 2 }}>
        <Typography>{labels.subtitle}</Typography>
      </Grid>
      <Grid sx={{ py: 1 }} size={7}>
        <Controller
          name="sourceType"
          key="sourceType"
          defaultValue={dataSourceType ?? defaultDataSourceTypeKey}
          shouldUnregister={true}
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
      <Grid container size={7} sx={{ px: 2, pt: 3, width: '100%' }}>
        {sourceParameters}
      </Grid>
    </Grid>
  );
};

DatasetCreationParameters.propTypes = {
  dataSourceRunTemplates: PropTypes.object.isRequired,
  parentDataset: PropTypes.object,
};
