// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useEffect, useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import { BasicTextInput, UploadFile, BasicEnumInput } from '@cosmotech/ui';
import { TranslationUtils } from '../../../../../../utils';
import { FileManagementUtils } from '../../../../../../utils/FileManagementUtils';
import { useDatasetCreationParameters } from './DatasetCreationParametersHook';

export const DatasetCreationParameters = ({ setDataSourceType, dataSourceType }) => {
  const { t } = useTranslation();
  const {
    dataSourceRunTemplates,
    getParameterEnumValues,
    dataSourceTypeEnumValues,
    getUploadFileLabels,
    getDefaultFileTypeFilter,
  } = useDatasetCreationParameters();

  const defaultDataSourceTypeKey = useMemo(() => dataSourceTypeEnumValues?.[0]?.key ?? '', [dataSourceTypeEnumValues]);

  useEffect(() => {
    if (dataSourceType == null) setDataSourceType(defaultDataSourceTypeKey);
  }, [dataSourceType, setDataSourceType, defaultDataSourceTypeKey]);

  const forgeInput = useCallback(
    (parameter) => {
      const parameterId = parameter.id;
      const inputType = parameter.varType;

      return (
        <Controller
          key={parameterId}
          name={parameterId}
          rules={{ required: true }}
          render={({ field }) => {
            const { value, onChange } = field;
            if (inputType === 'string') {
              return (
                <Grid item xs={12} sx={{ pt: 1 }}>
                  <BasicTextInput
                    id={parameterId}
                    key={parameterId}
                    label={t(TranslationUtils.getParameterTranslationKey(parameterId), parameterId)}
                    tooltipText={t(TranslationUtils.getParameterTooltipTranslationKey(parameterId), '')}
                    size="medium"
                    value={value ?? ''}
                    changeTextField={(newValue) => onChange(newValue)}
                  />
                </Grid>
              );
            } else if (inputType === 'enum') {
              const enumValues = getParameterEnumValues(parameterId);
              return (
                <Grid item xs={6} sx={{ pt: 2 }}>
                  <BasicEnumInput
                    id={parameterId}
                    key={parameterId}
                    label={t(TranslationUtils.getParameterTranslationKey(parameterId), parameterId)}
                    tooltipText={t(TranslationUtils.getParameterTooltipTranslationKey(parameterId), '')}
                    value={value ?? enumValues?.[0]?.key ?? ''}
                    changeEnumField={onChange}
                    textFieldProps={{ disabled: false, id: `enum-input-${parameterId}` }}
                    enumValues={enumValues}
                  />
                </Grid>
              );
            } else if (inputType === '%DATASETID%') {
              return (
                <Grid item xs={12} sx={{ pt: 1 }}>
                  <UploadFile
                    id={parameterId}
                    key={parameterId}
                    labels={getUploadFileLabels(parameterId)}
                    tooltipText={t(TranslationUtils.getParameterTooltipTranslationKey(parameterId), '')}
                    handleUploadFile={(event) => FileManagementUtils.prepareToUpload(event, onChange)}
                    editMode={true}
                    handleDeleteFile={() => onChange({})}
                    file={value ?? {}}
                    acceptedFileTypes={getDefaultFileTypeFilter(parameterId)}
                  />
                </Grid>
              );
            } else {
              console.error('DataSource parameter vartype unknown');
              return null;
            }
          }}
        />
      );
    },
    [t, getParameterEnumValues, getUploadFileLabels, getDefaultFileTypeFilter]
  );

  return (
    <>
      <Grid item xs={12}>
        <Typography sx={{ py: 2 }}>
          {t('commoncomponents.datasetmanager.wizard.secondScreen.subtitle', 'Please provide your data source')}
        </Typography>
      </Grid>
      <Grid item xs={7}>
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
                label={t('commoncomponents.datasetmanager.wizard.secondScreen.dataSourceType.label', 'Source')}
                size="medium"
                value={value ?? defaultDataSourceTypeKey}
                changeEnumField={setDatasetSource}
                enumValues={dataSourceTypeEnumValues}
              />
            );
          }}
        />
      </Grid>
      <Grid item container xs={12} sx={{ px: 2, pt: 3 }}>
        {dataSourceRunTemplates[dataSourceType]?.parameters?.map((parameter) => forgeInput(parameter))}
      </Grid>
    </>
  );
};

DatasetCreationParameters.propTypes = {
  setDataSourceType: PropTypes.func.isRequired,
  dataSourceType: PropTypes.string,
};
